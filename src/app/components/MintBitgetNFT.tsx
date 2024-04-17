"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { Turnstile } from '@marsidev/react-turnstile';

import { bitgetNFT } from '../assets';
import CustomConnectButton from './CustomConnectButton';

const MintBitgetNFT = () => {
  const [verified, setVerified] = useState(false);
  const account = useAccount();
  const connectedAddress = account?.address;

  return (
    <>
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
        {connectedAddress?.toString() !== "" && (
          <>
            <div className="mt-6 text-sm font-medium leading-5 text-zinc-300 max-md:max-w-full">
              YOUR WALLET ADDRESS
            </div>
            <label
              htmlFor="walletAddressInput"
              className="flex md:justify-between py-4 gap-2.5 px-3 mt-2 text-sm text-white whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-neutral-700 max-md:flex-wrap"
            >
              <input
                type="text"
                disabled
                id="walletAddressInput"
                name="walletAddressInput"
                className="flex-1 my-auto border-none text-gray-200 bg-transparent h-full outline-none"
                value={connectedAddress}
              />
            </label>
          </>
        )}
        <CustomConnectButton
          mint={true}
          verified={verified}
          walletAddress={connectedAddress}
        />
      </div>
      <Turnstile
        options={{
          theme: "dark",
        }}
        className="flex items-center justify-center pt-14"
        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ""}
        onSuccess={() => setVerified(true)}
        onExpire={() => setVerified(false)}
        onError={() => setVerified(false)}
      />
    </>
  );
}

export default MintBitgetNFT;