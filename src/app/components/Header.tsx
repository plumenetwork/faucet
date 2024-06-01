'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import PlumeLogo from './PlumeLogo';

const Header = () => {
  const pathname = usePathname();

  return (
    <div className='flex flex-col justify-center self-stretch rounded-2xl border border-solid border-zinc-800 bg-neutral-900'>
      <div className='flex flex-wrap justify-between px-8 py-4 max-md:px-5'>
        <div className='flex max-w-full items-center gap-4 whitespace-nowrap font-medium max-md:pr-0'>
          <div className='mr-3 justify-center self-start py-1.5 text-3xl text-white max-md:pl-5'>
            <PlumeLogo />
          </div>
          <Link href='/' passHref scroll={false}>
            <div
              className={`${
                pathname === '/' ? 'tab-button-active' : 'tab-button'
              }`}
            >
              Faucet
            </div>
          </Link>
        </div>
        <div className='flex gap-4 self-start'>
          <div className='my-auto hidden sm:block'>
            <div className='my-auto flex justify-center gap-1 rounded-full border border-solid border-neutral-700 bg-zinc-800 px-2.5 py-0.5'>
              <div className='my-auto flex flex-col justify-center p-1'>
                <div className='h-2 w-2 shrink-0 rounded-full bg-emerald-400' />
              </div>
              <div className='text-center text-xs font-medium leading-5 text-zinc-300'>
                Plume Testnet
              </div>
            </div>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </div>
  );
};

export default Header;
