"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { plume } from '../assets';

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center self-stretch rounded-2xl border border-solid bg-neutral-900 border-zinc-800">
      <div className="flex flex-wrap justify-between px-8 py-4 max-md:px-5">
        <div className="flex items-center gap-4 font-medium whitespace-nowrap max-w-full max-md:pr-0">
          <div className="justify-center mr-3 self-start py-1.5 text-3xl text-white max-md:pl-5">
            <Image src={plume} width={100} height={50} alt="plume" />
          </div>
          <Link href="/" passHref scroll={false}>
            <div
              className={`${pathname === "/" ? "tab-button-active" : "tab-button"
                }`}
            >
              Faucet
            </div>
          </Link>
        </div>
        <div className="flex gap-4 self-start">
          <div className="hidden sm:block my-auto">
            <div className="flex gap-1 justify-center px-2.5 py-0.5 my-auto rounded-full border border-solid bg-zinc-800 border-neutral-700">
              <div className="flex flex-col justify-center p-1 my-auto">
                <div className="shrink-0 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <div className="text-xs font-medium leading-5 text-center text-zinc-300">
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
