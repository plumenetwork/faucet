import { NextRequest } from 'next/server';
import { createWalletClient, publicActions, http, parseEther } from 'viem';
import { plumeTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

import { withRateLimiter } from '@/app/lib/rateLimiter';
import { FaucetToken } from '@/app/lib/types';
import IERC20 from './IERC20.json';

const tokenAddresses = {
  [FaucetToken.ETH]: '0x0',
  [FaucetToken.USDC]: '0xEa237441c92CAe6FC17Caaf9a7acB3f953be4bd1',
  [FaucetToken.USDT]: '0x4632403a83fb736Ab2c76b4C32FAc9F81e2CfcE2',
  [FaucetToken.DAI]: '0x1aa70741167155E08bD319bE096C94eE54C6CA19',
};

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http(),
}).extend(publicActions);

export const POST = withRateLimiter({
  limiterKeys: async (request: NextRequest) => {
    const ip = request.ip ?? '127.0.0.1';
    const json = await request.json();
    const walletAddress = json?.walletAddress?.toLowerCase() ?? '';
    const token: FaucetToken = json?.token?.toUpperCase() ?? FaucetToken.ETH;

    return [`${token}:${ip}`, `${token}:${walletAddress}`];
  },
  handler: async (req: Request): Promise<Response> => {
    const {
      walletAddress,
      token = FaucetToken.ETH,
    }: {
      walletAddress: `0x${string}`;
      token: FaucetToken;
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
      let txHash;

      if (token === 'ETH') {
        txHash = await walletClient.sendTransaction({
          to: walletAddress as `0x${string}`,
          value: parseEther('0.01'),
        });
        return Response.json({ txHash }, { status: 200 });
      } else {
        // get token decimals
        const decimals = Number(
          await walletClient.readContract({
            address: tokenAddresses[token] as `0x${string}`,
            abi: IERC20.abi,
            functionName: 'decimals',
          })
        );

        // send token
        txHash = await walletClient.writeContract({
          address: tokenAddresses[token] as `0x${string}`,
          abi: IERC20.abi,
          functionName: 'transfer',
          args: [
            walletAddress,
            // 100,000 tokens
            (100000 * Math.pow(10, decimals)).toLocaleString('en', {
              useGrouping: false,
            }),
          ],
        });

        return Response.json({ txHash }, { status: 200 });
      }
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'Failed to send token' }, { status: 503 });
    }
  },
});
