import type { Metadata } from "next";
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import { Toaster } from './components/ui/toaster';
import { Providers } from './provider';

const inter = Inter({ subsets: ["latin"] });
const lufga = localFont({ src: './fonts/lufga/LufgaRegular.woff', variable: '--font-lufga' });

export const metadata: Metadata = {
  title: "Plume Network",
  description: "Plume Network Faucet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lufga.variable}`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
