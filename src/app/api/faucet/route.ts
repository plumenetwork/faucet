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

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || '',
  keyPrefix: 'nonce:faucet:',
});

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http(),
}).extend(publicActions);

const TEN_MINUTES = 60 * 10;
const TWO_HOURS = 60 * 60 * 2;

const minTxCost = parseEther('0.00004');
const ethAmount = parseEther('0.001');

export const POST = withCaching({
  makeKeys: async (request: NextRequest) => {
    const ip =
      request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1';
    const json = await request.json();

    const walletAddress = json?.walletAddress?.toLowerCase() ?? '';
    const token: FaucetTokenType =
      json?.token?.toUpperCase() ?? FaucetToken.ETH;

    return [
      {
        key: `${token}:${ip}`,
        duration: token === FaucetToken.ETH ? TEN_MINUTES : TWO_HOURS,
      },
      {
        key: `${token}:${walletAddress}`,
        duration: token === FaucetToken.ETH ? TEN_MINUTES : TWO_HOURS,
      },
    ];
  },

  cleanseData: (data: any) => ({ ...data, tokenDrip: '' }),

  handler: withConcurrencyLimiter({
    keyPrefix: `concurrency:faucet:`,
    limit: 100,
  })(async (req: Request): Promise<any> => {
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
      return Response.json({ error: 'Invalid walletAddress' }, { status: 400 });
    }

    if (!Object.values(FaucetToken).includes(token)) {
      return Response.json({ error: 'Invalid token' }, { status: 400 });
    }

    try {
      const userBalance = await walletClient.getBalance({
        address: walletAddress,
      });
      let tokenDrip = '';

      if (userBalance < minTxCost) {
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
  }),
});
