import { NextRequest } from 'next/server';
import {
  createWalletClient,
  publicActions,
  http,
  parseEther,
  encodePacked,
  toHex,
  keccak256,
} from 'viem';
import { plumeTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

import { withConcurrencyLimiter } from '@/app/lib/concurrency';
import { FaucetToken, FaucetTokenType } from '@/app/lib/types';
import Redis from 'ioredis';
import { withCaching } from '@/app/lib/caching';
import { sharedCorsHeaders } from '@/app/lib/utils';
import FaucetABI from '@/app/abi/faucet';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || '',
  keyPrefix: 'nonce:faucet:',
});

const limiter = withConcurrencyLimiter({
  keyPrefix: `concurrency:faucet:`,
  limit: 1, // 1 concurrent request to for the nonce sequence
});

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http(),
}).extend(publicActions);

const TEN_MINUTES = 60 * 10;
const TWO_HOURS = 60 * 60 * 2;
const MIN_TX_COST = parseEther('0.00004');
export const OPTIONS = async () => {
  return Response.json({}, { status: 200, headers: sharedCorsHeaders });
};


const pendingDripRequests: string[] = [];
const processingDripRequests: string[] = [];
let resolvedDripTxHash: {[key: string]: string} = {};

export const POST = withCaching({
  makeKeys: async (request: NextRequest) => {
    let ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for') ??
      request.ip ??
      '127.0.0.1';
    ip = ip.replace(/:/gi, ';');

    const json = await request.json();
    const walletAddress = json?.walletAddress?.toLowerCase() ?? '';
    const token: FaucetTokenType =
      json?.token?.toUpperCase() ?? FaucetToken.ETH;

    return [
      {
        key: `${token}:ip:${ip}`,
        duration: token === FaucetToken.ETH ? TEN_MINUTES : TWO_HOURS,
      },
      {
        key: `${token}:wallet:${walletAddress}`,
        duration: token === FaucetToken.ETH ? TEN_MINUTES : TWO_HOURS,
      },
    ];
  },

  cleanseData: (data: any) => data && { ...data, tokenDrip: '' },

  handler: async (req: Request): Promise<any> => {
    const {
      walletAddress,
      token = FaucetToken.ETH,
    }: {
      walletAddress: `0x${string}`;
      token: FaucetTokenType;
    } = await req.json();

    if (
      !walletAddress ||
      typeof walletAddress !== 'string' ||
      walletAddress.length !== 42 ||
      !walletAddress.match(/^0x[0-9a-fA-F]+$/)
    ) {
      return Response.json(
        { error: 'Invalid walletAddress' },
        { status: 400, headers: sharedCorsHeaders }
      );
    }

    if (!Object.values(FaucetToken).includes(token)) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 400, headers: sharedCorsHeaders }
      );
    }

    try {
      const userBalance = await walletClient.getBalance({
        address: walletAddress,
      });
      let tokenDrip = '';

      if (userBalance < MIN_TX_COST) {
        pendingDripRequests.push(walletAddress);

        await limiter(async () => {
          if (resolvedDripTxHash[walletAddress]) {
            tokenDrip = resolvedDripTxHash[walletAddress];
            delete resolvedDripTxHash[walletAddress];
            return;
          }

          processingDripRequests.push(...pendingDripRequests);
          pendingDripRequests.length = 0;

          const [faucetAddress] = await walletClient.getAddresses();

          let nonce;
          const [walletNonce, redisNonce] = await Promise.all([
            walletClient.getTransactionCount({
              address: faucetAddress,
              blockTag: 'pending',
            }),
            redis.incr(faucetAddress),
          ]);

          if (walletNonce > redisNonce) {
            redis.set(faucetAddress, walletNonce);
            nonce = walletNonce;
          } else {
            nonce = redisNonce;
          }

          const hash = await walletClient
            .writeContract({
              address: process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}`,
              abi: FaucetABI,
              functionName: "giveGasTokens",
              nonce,
              args: [
                pendingDripRequests,
              ]
            })
            .catch(async (e) => {
              const latestWalletNonce = await walletClient.getTransactionCount({
                address: faucetAddress,
              });

              if (latestWalletNonce < nonce) {
                redis.set(faucetAddress, latestWalletNonce - 1);
              }

              throw e;
            });

          processingDripRequests.forEach((address) => {
            if (address !== walletAddress)
              resolvedDripTxHash[address] = hash;
          });

          processingDripRequests.length = 0;
          tokenDrip = hash;

          // wait 100 milliseconds for the TX to propagate through mem-pool
          await new Promise((resolve) => setTimeout(resolve, 100));
        })();
      }

      const salt = keccak256(toHex(`${Date.now()}|${Math.random()}`));
      const encodedData = encodePacked(
        ['address', 'string', 'bytes32'],
        [walletAddress, token, salt]
      );
      const message = keccak256(encodedData);
      const signature = await walletClient.signMessage({
        message: { raw: message },
      });

      return {
        tokenDrip,
        walletAddress,
        token,
        salt,
        signature,
      };
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'Failed to send token' }, { status: 503 });
    }
  },
});
