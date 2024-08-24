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

const redisConnection = process.env.REDIS_SYNC || '';
const redisUrl = new URL(redisConnection);

const redis = new Redis({
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  password: redisUrl.password,
  keyPrefix: 'nonce:faucet:',
});

const limiter = withConcurrencyLimiter({
  keyPrefix: `concurrency:faucet:`,
  limit: 10,
});

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http(),
}).extend(publicActions);

const ONE_HOUR = 60 * 60;
const TWO_HOURS = 60 * 60 * 2;

const minTxCost = parseEther('0.001');
const ethAmount = parseEther('0.003');

export const OPTIONS = async () => {
  return Response.json({}, { status: 200, headers: sharedCorsHeaders });
};

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
        duration: token === FaucetToken.ETH ? ONE_HOUR : TWO_HOURS,
      },
      {
        key: `${token}:wallet:${walletAddress}`,
        duration: token === FaucetToken.ETH ? ONE_HOUR : TWO_HOURS,
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

      if (userBalance < minTxCost) {
        await limiter(async () => {
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
            .sendTransaction({
              to: walletAddress as `0x${string}`,
              value: ethAmount,
              nonce,
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

          // wait 100 milliseconds for the TX to propagate through mem-pool
          await new Promise((resolve) => setTimeout(resolve, 100));

          tokenDrip = hash;
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
