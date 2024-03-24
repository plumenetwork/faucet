"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { Turnstile } from '@marsidev/react-turnstile';

import { ethereum, faucetIcon } from '../assets';
import CustomConnectButton from './CustomConnectButton';

const CoreFaucet = () => {
  const [verified, setVerified] = useState(false);
  const account = useAccount();
  const connectedAddress = account?.address;

  // 'connecting' | 'reconnecting' | 'connected' | 'disconnected'
  const connectedWalletStatus = account?.status;

  return (
    <>
      <div className="flex flex-col justify-center px-5 py-5 mt-8 max-w-full rounded-2xl border border-solid bg-neutral-900 border-zinc-800 w-[496px]">
        <div className="flex gap-4 max-md:flex-wrap items-center">
          <Image src={faucetIcon} width={48} height={48} alt="faucet" />
          <div className="flex flex-col flex-1 pr-4">
            <div className="text-lg font-semibold leading-7 text-white">
              WELCOME BITGET USERS!
            </div>
            <div className="text-sm leading-5 text-zinc-300">
              Use this faucet to get Plume testnet tokens ahead of our
              incentivized campaign.
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-6 h-px border border-solid bg-zinc-800 border-zinc-800 max-md:max-w-full" />
        <div className="mt-6 text-sm font-medium leading-5 text-zinc-300 max-md:max-w-full">
          TOKEN
        </div>
        <label
          htmlFor="walletAddressInput"
          className="flex gap-2.5 justify-center px-3 py-2.5 mt-2 text-sm text-white whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-neutral-700 max-md:flex-wrap"
        >
          <Image src={ethereum} width={32} height={32} alt="ethereum" />
          <div className="flex-2 my-auto">ETH</div>
          <input
            type="text"
            id="walletAddressInput"
            name="walletAddressInput"
            className="flex-1 my-auto border-none text-gray-600 bg-transparent h-full outline-none"
            placeholder=""
          />
        </label>

        <CustomConnectButton verified={verified} />
      </div>
      <Turnstile
        options={{
          theme: "dark",
        }}
        className="flex items-center justify-center pt-6"
        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ""}
        onSuccess={() => setVerified(true)}
        onExpire={() => setVerified(false)}
        onError={() => setVerified(false)}
      />
    </>
  );
};

export default CoreFaucet;
