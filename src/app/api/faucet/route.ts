import { NextRequest } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { plumeTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import { withRateLimiter } from "@/app/lib/rateLimiter";
import IERC20 from "./IERC20.json";

const tokenAddresses = {
  USDC: "0xEa237441c92CAe6FC17Caaf9a7acB3f953be4bd1",
  DAI: "0x1aa70741167155E08bD319bE096C94eE54C6CA19",
}

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.FAUCET_ACCOUNT_PRIVATE_KEY}`),
  chain: plumeTestnet,
  transport: http()
})

export const POST = withRateLimiter({
  limiterKeys:
      async (request: NextRequest) => {
        const ip = request.ip ?? '127.0.0.1';
        const json = await request.json();
        const walletAddress = json?.walletAddress?.toLowerCase() ?? '';
        const token = json?.token?.toUpperCase() ?? 'ETH';

        return [`${token}:${ip}`, `${token}:${walletAddress}`];
      },
  handler:
      async (req: Request): Promise<Response> => {
        const { walletAddress, token = "ETH" } = await req.json()

        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.length !== 42
            || !walletAddress.startsWith("0x") || !walletAddress.match(/^[0-9a-fA-FxX]+$/)) {
          return new Response("Invalid walletAddress", { status: 400 });
        }

        console.log(`Requesting ${token} for ${walletAddress}`);

        try {
          let txHash;

          if (token === "ETH") {
            txHash = await walletClient.sendTransaction({
              to: walletAddress as `0x${string}`,
              value: parseEther('0.01')
            })
            return Response.json({ txHash }, { status: 200 });
          }

          if (token === "USDC" || token === "DAI") {
            // send token
            txHash = await walletClient.writeContract({
              address: tokenAddresses[token as "USDC" | "DAI"] as `0x${string}`,
              abi: IERC20.abi,
              functionName: "transfer",
              args: [walletAddress, parseEther('0.01')]
            })

            return Response.json({ txHash }, { status: 200 });
          }
        } catch (e) {
          console.error(e);
          return new Response("Failed to send token", { status: 503 });
        }

        return new Response("Invalid token", { status: 400 });
      }
})
