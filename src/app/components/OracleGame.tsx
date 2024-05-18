"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { Turnstile } from '@marsidev/react-turnstile';

import { faucetIcon } from '../assets';
import OracleGameButton from './OracleGameButton';

const OracleGame = () => {
  const [verified, setVerified] = useState(false);
  const account = useAccount();
  const connectedAddress = account?.address;

  return (
    <>
      <div className="flex flex-col justify-center px-5 py-5 mt-8 max-w-full rounded-2xl border border-solid bg-neutral-900 border-zinc-800 md:w-[496px]">
        <div className="flex gap-4 md:flex-wrap items-center">
          <Image src={faucetIcon} width={48} height={48} alt="faucet" />
          <div className="flex flex-col flex-1 pr-4">
            <div className="text-lg font-semibold leading-7 text-white">
              WELCOME TO THE ORACLE GAME!
            </div>
            <div className="text-sm leading-5 text-zinc-300">
              Please make a guess for what the price of Bitcoin will be in one hour below.
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-6 h-px border border-solid bg-zinc-800 border-zinc-800 max-md:max-w-full" />
        <label
          htmlFor="priceGuess"
          className="flex md:justify-between gap-1 px-3 py-2.5 mt-2 text-sm text-white whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-neutral-700 max-md:flex-wrap"
        >
          <div className="my-auto">$</div>
          <input
            type="number"
            id="priceGuess"
            name="priceGuess"
            className="flex-1 my-auto border-none text-gray-200 bg-transparent h-full outline-none"
          />
        </label>
        <OracleGameButton
          mint={false}
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
};

export default OracleGame;
