"use client";

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PlumeLogo from '@/app/components/PlumeLogo';
import PlumeLogoWithoutText from '@/app/components/PlumeLogoWithoutText';
import { OpenInNewTabIcon } from '@/app/icons/OpenInNewTabIcon';
import { config } from '@/app/config';

const PlumeNavBar = () => {
  return <div className="flex flex-row justify-between bg-white text-black py-4 px-8">
    <div className="flex flex-row gap-8 sm:gap-4 items-center">
      <PlumeLogo className="hidden sm:block" />
      <PlumeLogoWithoutText className="sm:hidden" />
      <Link href="/" className="hidden sm:block bg-gray-100 px-3 py-2 rounded-lg font-lufga">Faucet</Link>
      <Link href={config.plumeBridgeUrl} target="_blank" className="flex flex-row items-center gap-1 text-gray-500 font-lufga">
        Bridge
        <OpenInNewTabIcon />
      </Link>
    </div>
    <div className="flex flex-row gap-4">
      <PlumeTestnetIndicator />
      <ConnectButton showBalance={false} />
    </div>
  </div>
}

export default PlumeNavBar;

const PlumeTestnetIndicator = () => {
  return <div className="hidden md:block my-auto">
    <div
      className="flex gap-1 justify-center px-2.5 py-0.5 my-auto rounded-full border border-solid bg-gray-50 border-gray-200">
      <div className="flex flex-col justify-center p-1 my-auto">
        <div className="shrink-0 w-2 h-2 bg-green-400 rounded-full" />
      </div>
      <div className="text-xs font-medium leading-5 text-center text-gray-600">
        Plume Testnet
      </div>
    </div>
  </div>
}
