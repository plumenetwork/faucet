import { useSearchParams } from 'next/navigation';
import { config } from '@/app/config';

export const useBackdoorSearchParams = () => {
  const searchParams = useSearchParams();

  const bypassCloudflareTurnstile =
    searchParams.get('bypassCloudflareTurnstile') === 'true';
  const includeMockWallet = searchParams.get('includeMockWallet') === 'true';
  const mockedWalletAccount = searchParams.get('mockedWalletAccount') as
    | `0x${string}`
    | undefined;

  return {
    bypassCloudflareTurnstile: config.enableBypassCloudflareTurnstile
      ? bypassCloudflareTurnstile
      : false,
    includeMockWallet: config.enabledMockedWallet ? includeMockWallet : false,
    mockedWalletAccount: config.enabledMockedWalletAccount
      ? mockedWalletAccount
      : undefined,
  };
};
