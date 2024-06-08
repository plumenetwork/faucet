import type { Metadata } from 'next';
import './globals.css';
import './site.css';
import '@rainbow-me/rainbowkit/styles.css';

import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';

import DatadogInit from './components/datadog-init';
import { Toaster } from './components/ui/toaster';
import { Providers } from './provider';
import { config } from '@/app/config';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });
const lufga = localFont({
  src: [
    { path: './fonts/lufga/LufgaThin.woff', weight: '100', style: 'normal' },
    {
      path: './fonts/lufga/LufgaExtraLight.woff',
      weight: '200',
      style: 'normal',
    },
    { path: './fonts/lufga/LufgaLight.woff', weight: '300', style: 'normal' },
    { path: './fonts/lufga/LufgaMedium.woff', weight: '400', style: 'normal' },
    { path: './fonts/lufga/LufgaRegular.woff', weight: '500', style: 'normal' },
    {
      path: './fonts/lufga/LufgaSemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    { path: './fonts/lufga/LufgaBold.woff', weight: '700', style: 'normal' },
    {
      path: './fonts/lufga/LufgaExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-lufga',
});

export const metadata: Metadata = {
  title: 'Plume Network Faucet',
  description:
    'Plume Faucet: Your gateway to testnet tokens! Claim ETH, USDC, USDT, and DAI on the Plume testnet. Start testing your projects hassle-free.',
  metadataBase: new URL(config.metadataBase),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${lufga.variable}`}>
        <DatadogInit />
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
