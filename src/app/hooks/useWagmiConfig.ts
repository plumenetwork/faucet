import { Config } from 'wagmi';
import { plumeTestnet } from 'wagmi/chains';
import {
  bitgetWallet,
  coinbaseWallet,
  foxWallet,
  metaMaskWallet,
  okxWallet,
  trustWallet,
  walletConnectWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import { config } from '@/app/config';
import { getMockWallet } from '@/app/mockWallet/mockWallet';
import { useBackdoorSearchParams } from '@/app/hooks/useBackdoorSearchParams';

export const useWagmiConfig = (): { wagmiConfig: Config } => {
  const { includeMockWallet, mockedWalletAccount } = useBackdoorSearchParams();
  const mockWallet = getMockWallet(mockedWalletAccount);

  const wagmiConfig = getDefaultConfig({
    appName: 'Plume Network Faucet',
    projectId: config.rainbowProjectId,
    wallets: [
      {
        groupName: 'Recommended',
        wallets: [
          foxWallet,
          bitgetWallet,
          metaMaskWallet,
          coinbaseWallet,
          okxWallet,
          trustWallet,
          zerionWallet,
          walletConnectWallet,
          ...(includeMockWallet ? [mockWallet] : []),
        ],
      },
    ],
    chains: [plumeTestnet],
    ssr: true,
  });

  return {
    wagmiConfig,
  };
};
