import Image from 'next/image';
import * as React from 'react';

import { bitgetNFT } from '../assets';

function MintBitgetNFT() {
  return (
    <div className="flex flex-col justify-center px-4 py-6 text-base font-medium leading-6 rounded-2xl border border-solid bg-neutral-900 border-zinc-800 max-w-[496px]">
      <div className="self-center text-2xl font-semibold text-white">
        Welcome Bitget users!
      </div>
      <div className="self-start mt-2 leading-6 text-center text-neutral-400 max-md:max-w-full">
        Mint this limited-time NFT directly into your wallet on our testnet to
        earn points.
      </div>
      <div className="shrink-0 mt-6 h-px border border-solid bg-zinc-800 border-zinc-800 max-md:max-w-full" />
      <Image src={bitgetNFT} alt="Bitget NFT" width={500} height={500} />
      <div className="justify-center text-center items-center px-6 py-3 mt-4 rounded-lg bg-neutral-50 text-zinc-800 max-md:px-5 max-md:max-w-full">
        Connect Wallet
      </div>
    </div>
  );
}

export default MintBitgetNFT;
