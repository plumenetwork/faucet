import { Config } from 'wagmi';
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
import { useBackdoorSearchParams } from '@/app/hooks/useBackdoorSearchParams';
import { getAutoWallet } from '@/app/autoWallet/autoWallet';
import { plumeDevnet } from '../chains';

export const useWagmiConfig = (): { wagmiConfig: Config } => {
  const { includeAutoWallet } = useBackdoorSearchParams();
  const autoWallet = getAutoWallet();

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
          ...(includeAutoWallet ? [autoWallet] : []),
        ],
      },
    ],
    chains: [plumeDevnet],
    ssr: true,
  });

  return {
    wagmiConfig,
  };
};
