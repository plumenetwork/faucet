"use client";
import Image from 'next/image';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { plume } from '../assets';

function onClickConnectWallet() {}

const Header = () => (
  <div className="flex flex-col justify-center self-stretch rounded-2xl border border-solid bg-neutral-900 border-zinc-800">
    <div className="flex flex-wrap justify-between px-8 py-4 max-md:px-5">
      <div className="flex gap-5 pr-20 font-medium whitespace-nowrap max-w-full max-md:pr-0">
        <div className="justify-center items-start self-start px-11 py-1.5 text-3xl text-white max-md:pl-5">
          <Image src={plume} width={100} height={50} alt="plume" />
        </div>
        {/* <div className="hidden md:flex gap-3 justify-between text-base leading-6">
          <div className="my-auto text-neutral-400">Bridge</div>
          <div className="justify-center px-3 py-2 text-white rounded-md bg-zinc-800">
            Faucet
          </div>
        </div> */}
      </div>
      <div className="flex gap-4 self-start">
        <div className="flex gap-1 justify-center px-2.5 py-0.5 my-auto rounded-full border border-solid bg-zinc-800 border-neutral-700">
          <div className="flex flex-col justify-center p-1 my-auto">
            <div className="shrink-0 w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
          <div className="text-xs font-medium leading-5 text-center text-zinc-300">
            Plume Testnet
          </div>
        </div>
        <ConnectButton />
      </div>
    </div>
  </div>
);

export default Header;
