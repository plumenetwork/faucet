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
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Plume Network Faucet',
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        foxWallet,
        injectedWallet,
        bitgetWallet,
        metaMaskWallet,
        coinbaseWallet,
        okxWallet,
        trustWallet,
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
    <WagmiProvider config={config}>
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
