const successCloudflareTurnStileSiteKey = '1x00000000000000000000AA';

export const config: FaucetConfig = {
  plumeBridgeUrl: 'https://testnet-bridge.plumenetwork.xyz/',
  successCloudflareTurnStileSiteKey,
  cloudflareTurnstileSiteKey:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ??
    successCloudflareTurnStileSiteKey,
  rainbowProjectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
  dataDogApplicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || '',
  dataDogClientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  dataDogService: process.env.NEXT_PUBLIC_DATADOG_SERVICE || '',
  dataDogEnv: process.env.NEXT_PUBLIC_DATADOG_ENV || 'local',
  metadataBase:
    process.env.NEXT_PUBLIC_METADATA_BASE ??
    `https://${process.env.VERCEL_URL ?? 'localhost:' + (process.env.PORT || 3000)}`,
  // Backdoor flags
  enableBypassCloudflareTurnstile:
    process.env.NEXT_PUBLIC_ENABLE_BYPASS_CLOUDFLARE_TURNSTILE === 'true',
  enabledAutoWallet: process.env.NEXT_PUBLIC_ENABLED_AUTO_WALLET === 'true',
};

type FaucetConfig = {
  plumeBridgeUrl: string;
  successCloudflareTurnStileSiteKey: string;
  cloudflareTurnstileSiteKey: string;
  rainbowProjectId: string;
  dataDogApplicationId: string;
  dataDogClientToken: string;
  dataDogService: string;
  dataDogEnv: string;
  metadataBase: string;
  // Backdoor flags
  enableBypassCloudflareTurnstile: boolean;
  enabledAutoWallet: boolean;
};
