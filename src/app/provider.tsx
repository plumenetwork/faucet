'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { plumeTestnet } from 'wagmi/chains';
import colors from 'tailwindcss/colors';

import {
  lightTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from '@/app/config';

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
      ],
    },
  ],
  chains: [plumeTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: colors.gray[800],
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
