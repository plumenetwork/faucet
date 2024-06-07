export const config: FaucetConfig = {
  plumeBridgeUrl: 'https://testnet-bridge.plumenetwork.xyz/',
  cloudflareTurnstileSiteKey:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    '1x00000000000000000000AA',
  rainbowProjectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
  dataDogApplicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || '',
  dataDogClientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  dataDogService: process.env.NEXT_PUBLIC_DATADOG_SERVICE || '',
  dataDogEnv: process.env.NEXT_PUBLIC_DATADOG_ENV || 'local',
  metadataBase:
    process.env.NEXT_PUBLIC_METADATA_BASE ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`),
};

type FaucetConfig = {
  plumeBridgeUrl: string;
  cloudflareTurnstileSiteKey: string;
  rainbowProjectId: string;
  dataDogApplicationId: string;
  dataDogClientToken: string;
  dataDogService: string;
  dataDogEnv: string;
  metadataBase: string;
};
