export const config: FaucetConfig = {
  plumeBridgeUrl: 'https://testnet-bridge.plumenetwork.xyz/',
  cloudflareTurnstileSiteKey:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    '1x00000000000000000000AA',
  rainbowProjectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
};

type FaucetConfig = {
  plumeBridgeUrl: string;
  cloudflareTurnstileSiteKey: string;
  rainbowProjectId: string;
};
