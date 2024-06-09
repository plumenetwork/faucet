import { useSearchParams } from 'next/navigation';

export const useBackdoorSearchParams = () => {
  const searchParams = useSearchParams();

  return {
    bypassCloudflareTurnstile:
      searchParams.get('bypassCloudflareTurnstile') === 'true',
    includeMockWallet: searchParams.get('includeMockWallet') === 'true',
    mockedWalletAccount: searchParams.get('mockedWalletAccount') as
      | `0x${string}`
      | undefined,
  };
};
