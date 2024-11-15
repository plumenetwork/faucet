'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PlumeLogo from '@/app/components/PlumeLogo';
import PlumeLogoWithoutText from '@/app/components/PlumeLogoWithoutText';
import { OpenInNewTabIcon } from '@/app/icons/OpenInNewTabIcon';
import { config } from '@/app/config';
import { FC } from 'react';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';

const PlumeNavBar: FC = () => {
  const { isConnected } = useFaucetWallet();

  return (
    <div className='flex flex-row justify-between rounded-3xl bg-white px-8 py-4 text-black'>
      <div className='flex flex-row items-center gap-8 sm:gap-4'>
        <Link href='/'>
          <PlumeLogoWithoutText className='size-8' />
        </Link>
      </div>
      <div className='flex flex-row gap-4'>
        <ConnectButton showBalance={false} />
      </div>
    </div>
  );
};

export default PlumeNavBar;
