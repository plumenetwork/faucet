import type { Metadata } from "next";
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { Inter } from 'next/font/google';

import { Providers } from './provider';

const inter = Inter({ subsets: ["latin"] });
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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
