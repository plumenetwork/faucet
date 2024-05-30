import { withRateLimiter } from "@/app/lib/rateLimiter";

export const POST = withRateLimiter(async (req: Request): Promise<Response> => {
  const { walletAddress } = await req.json()
  return fetch("https://dashboard.caldera.xyz/api/v0/faucet/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CALDERA_FAUCET_API_KEY}`,
      ['Content-Type']: "application/json",
    },
    body: JSON.stringify({
      rollupId: "plume-testnet",
      walletAddress
    }),
  })
})
