'use client';

import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

import { Turnstile } from '@marsidev/react-turnstile';

import { FaucetIcon } from '@/app/icons/FaucetIcon';
import { FaucetToken } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';

const CoreFaucet = () => {
  const [verified, setVerified] = useState(false);

  const account = useAccount();
  const connectedAddress = account?.address;
  const [token, setToken] = useState<FaucetToken>(FaucetToken.ETH);

  return (
    <>
      <div className='mt-8 flex max-w-full flex-col justify-center rounded-2xl border border-solid border-zinc-800 bg-neutral-900 px-5 py-5 md:w-[496px]'>
        <div className='flex items-center gap-4 md:flex-wrap'>
          <FaucetIcon />
          <div className='flex flex-1 flex-col pr-4'>
            <div className='text-lg font-semibold leading-7 text-white'>
              WELCOME FOX WALLET USERS!
            </div>
            <div className='text-sm leading-5 text-zinc-300'>
              Use this faucet to get Plume testnet tokens ahead of our
              incentivized campaign.
            </div>
          </div>
        </div>
        <div className='mt-6 h-px shrink-0 border border-solid border-zinc-800 bg-zinc-800 max-md:max-w-full' />
        <div className='mt-6 text-sm font-medium leading-5 text-zinc-300 max-md:max-w-full'>
          TOKEN
        </div>
        <label
          htmlFor='tokenInput'
          className='mt-2 flex gap-2.5 whitespace-nowrap rounded-lg border border-solid border-neutral-700 bg-zinc-800 px-3 py-2.5 text-sm text-white max-md:flex-wrap md:justify-between'
        >
          <select
            id='tokenInput'
            name='tokenInput'
            className='my-auto h-full flex-1 border-none bg-transparent text-gray-200 outline-none'
            value={token}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setToken(e.target.value as FaucetToken)
            }
          >
            <option value='ETH'>ETH</option>
            <option value='USDC'>USDC</option>
            <option value='USDT'>USDT</option>
            <option value='DAI'>DAI</option>
          </select>
        </label>

        {connectedAddress?.toString() !== '' && (
          <>
            <div className='mt-6 text-sm font-medium leading-5 text-zinc-300 max-md:max-w-full'>
              YOUR WALLET ADDRESS
            </div>
            <label
              htmlFor='walletAddressInput'
              className='mt-2 flex gap-2.5 whitespace-nowrap rounded-lg border border-solid border-neutral-700 bg-zinc-800 px-3 py-4 text-sm text-white max-md:flex-wrap md:justify-between'
            >
              <input
                type='text'
                disabled
                id='walletAddressInput'
                name='walletAddressInput'
                className='my-auto h-full flex-1 border-none bg-transparent text-gray-200 outline-none'
                value={connectedAddress}
              />
            </label>
          </>
        )}

        <CustomConnectButton
          verified={verified}
          walletAddress={connectedAddress}
          token={token}
        />
        <Turnstile
          options={{
            theme: 'dark',
          }}
          className='mx-auto flex items-center justify-center'
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ''}
          onSuccess={() => setVerified(true)}
          onExpire={() => setVerified(false)}
          onError={() => setVerified(false)}
        />
      </div>
    </>
  );
};

export default CoreFaucet;
