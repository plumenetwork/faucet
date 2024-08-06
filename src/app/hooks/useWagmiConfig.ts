import { Config } from 'wagmi';
import { plumeTestnet } from 'wagmi/chains';
import {
  bitgetWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import { config } from '@/app/config';

export const useWagmiConfig = (): { wagmiConfig: Config } => {

  const wagmiConfig = getDefaultConfig({
    appName: 'Plume / Bitget task2get Claim',
    projectId: config.rainbowProjectId,
    wallets: [
      {
        groupName: 'Connect to Bitget',
        wallets: [
          bitgetWallet,
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
