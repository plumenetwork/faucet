'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PlumeLogo from '@/app/components/PlumeLogo';
import PlumeLogoWithoutText from '@/app/components/PlumeLogoWithoutText';
import { OpenInNewTabIcon } from '@/app/icons/OpenInNewTabIcon';
import { config } from '@/app/config';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { plumeTestnet } from 'wagmi/chains';

const PlumeNavBar: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className='flex flex-row justify-between bg-white px-8 py-4 text-black'>
      <div className='flex flex-row items-center gap-8 sm:gap-4'>
        <PlumeLogo className='hidden sm:block' />
        <PlumeLogoWithoutText className='sm:hidden' />
        <Link
          href='/'
          className='hidden rounded-lg bg-gray-100 px-3 py-2 font-lufga sm:block'
        >
          Faucet
        </Link>
        <Link
          href={config.plumeBridgeUrl}
          target='_blank'
          className='flex flex-row items-center gap-1 font-lufga text-gray-500'
        >
          Bridge
          <OpenInNewTabIcon />
        </Link>
      </div>
      <div className='flex flex-row gap-4'>
        {isConnected && <PlumeTestnetIndicator />}
        <ConnectButton showBalance={false} />
      </div>
    </div>
  );
};

export default PlumeNavBar;

const PlumeTestnetIndicator: FC = () => {
  const { chainId } = useAccount();
  const isPlumeTestnet = chainId === plumeTestnet.id;

  return (
    <div className='my-auto hidden md:block'>
      <div className='my-auto flex justify-center gap-1 rounded-full border border-solid border-gray-200 bg-gray-50 px-2.5 py-0.5'>
        <div className='my-auto flex flex-col justify-center p-1'>
          {isPlumeTestnet ? (
            <div className='h-2 w-2 shrink-0 rounded-full bg-green-400' />
          ) : (
            <div className='h-2 w-2 shrink-0 rounded-full bg-gray-200' />
          )}
        </div>
        <div className='text-center text-xs font-medium leading-5 text-gray-600'>
          Plume Testnet
        </div>
      </div>
    </div>
  );
};
