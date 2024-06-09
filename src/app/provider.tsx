'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import colors from 'tailwindcss/colors';
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useWagmiConfig } from '@/app/hooks/useWagmiConfig';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { wagmiConfig } = useWagmiConfig();

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
