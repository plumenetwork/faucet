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
import { withRateLimiter } from '@/app/lib/rateLimiter';
import { FaucetToken } from '@/app/lib/types';

const minTxCost = parseEther('0.0001');

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http(),
}).extend(publicActions);

export const POST = withRateLimiter({
  limiterKeys: async (request: NextRequest) => {
    const ip =
      request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1';
    const json = await request.json();

    const walletAddress = json?.walletAddress?.toLowerCase() ?? '';
    const token: FaucetToken = json?.token?.toUpperCase() ?? FaucetToken.ETH;

    return [`${token}:${ip}`, `${token}:${walletAddress}`];
  },

  handler: withConcurrencyLimiter('concurrency:faucet:', 100)(async (req: Request): Promise<Response> => {
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
      const userBalance = await walletClient.getBalance({ address: walletAddress });

      if (userBalance < minTxCost) {
        const hash = await walletClient.sendTransaction({
          to: walletAddress as `0x${string}`,
          value: minTxCost,
        });

        await walletClient.waitForTransactionReceipt({
          hash,
          confirmations: 4, // ~ 1 second
        })
      }

      const salt = keccak256(toHex(`${Date.now()}|${Math.random()}`));
      const encodedData = encodePacked(
        ['address', 'string', 'bytes32'],
        [walletAddress, token, salt]
      )
      const message = keccak256(encodedData);
      const signature = await walletClient.signMessage({ message: { raw: message } });

      return Response.json({ walletAddress, token, salt, signature }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'Failed to send token' }, { status: 503 });
    }
  }),
});
