import { config } from '@/app/config';
import { useSearchParams } from 'next/navigation';

export const useCloudflareTurnstile = () => {
  // If there is a query parameter bypassCloudflareTurnstile=true, bypass the Cloudflare turnstile by using a success Cloudflare site key
  // TODO: Remove this bypass once testing is complete
  const searchParams = useSearchParams();

  const bypassCloudflareTurnstileString = searchParams.get(
    'bypassCloudflareTurnstile'
  );
  const bypassCloudflareTurnstile = bypassCloudflareTurnstileString === 'true';
  const cloudflareTurnstileSiteKey = bypassCloudflareTurnstile
    ? config.successCloudflareTurnStileSiteKey
    : config.cloudflareTurnstileSiteKey;

  return {
    cloudflareTurnstileSiteKey,
  };
};
