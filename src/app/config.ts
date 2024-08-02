export const config: FaucetConfig = {
  plumeBridgeUrl: 'https://testnet-bridge.plumenetwork.xyz/',
  cloudflareTurnstileSiteKey:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '',
  rainbowProjectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
  metadataBase:
    process.env.NEXT_PUBLIC_METADATA_BASE ??
    `https://${process.env.VERCEL_URL ?? 'localhost:' + (process.env.PORT || 3000)}`,
  isBitgetFaucet: process.env.NEXT_PUBLIC_IS_BITGET_FAUCET === 'true',
  faucetContractAddress: process.env
    .NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}`,
  // Backdoor flags
  enableBypassCloudflareTurnstile:
    process.env.NEXT_PUBLIC_ENABLE_BYPASS_CLOUDFLARE_TURNSTILE === 'true',
  enabledAutoWallet: process.env.NEXT_PUBLIC_ENABLED_AUTO_WALLET === 'true',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
};

type FaucetConfig = {
  plumeBridgeUrl: string;
  cloudflareTurnstileSiteKey: string;
  rainbowProjectId: string;
  metadataBase: string;
  isBitgetFaucet: boolean;
  faucetContractAddress: `0x${string}`;
  // Backdoor flags
  enableBypassCloudflareTurnstile: boolean;
  enabledAutoWallet: boolean;
  apiUrl: string;
};
