import { useSearchParams } from 'next/navigation';
import { config } from '@/app/config';

export const useBackdoorSearchParams = () => {
  const searchParams = useSearchParams();

  const bypassCloudflareTurnstile =
    searchParams.get('bypassCloudflareTurnstile') === 'true';
  const includeAutoWallet = searchParams.get('includeAutoWallet') === 'true';

  return {
    bypassCloudflareTurnstile: config.enableBypassCloudflareTurnstile
      ? bypassCloudflareTurnstile
      : false,
    includeAutoWallet: config.enabledAutoWallet ? includeAutoWallet : false,
  };
};
