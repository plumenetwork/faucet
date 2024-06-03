export const config: FaucetConfig = {
  plumeBridgeUrl: 'https://testnet-bridge.plumenetwork.xyz/',
  cloudflareTurnstileSiteKey:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    '1x00000000000000000000AA',
};

type FaucetConfig = {
  plumeBridgeUrl: string;
  cloudflareTurnstileSiteKey: string;
};
