import { config } from '@/app/config';
import { useBackdoorSearchParams } from '@/app/hooks/useBackdoorSearchParams';

export const useCloudflareTurnstile = () => {
  // If there is a query parameter bypassCloudflareTurnstile=true, bypass the Cloudflare turnstile by using a success Cloudflare site key
  // TODO: Remove this bypass once testing is complete
  const { bypassCloudflareTurnstile } = useBackdoorSearchParams();
  const cloudflareTurnstileSiteKey = bypassCloudflareTurnstile
    ? config.successCloudflareTurnStileSiteKey
    : config.cloudflareTurnstileSiteKey;

  return {
    cloudflareTurnstileSiteKey,
  };
};
