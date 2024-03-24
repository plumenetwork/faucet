"use client";

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import {
    darkTheme, getDefaultConfig, getDefaultWallets, RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { bitgetWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "Plume Network Faucet",
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || "",
  wallets: [
    {
      groupName: "Bitget Wallet",
      wallets: [bitgetWallet],
    },
  ],
  chains: [mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#FF692E",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
