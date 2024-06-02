'use client';

import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

import { Turnstile } from '@marsidev/react-turnstile';

import { FaucetIcon } from '@/app/icons/FaucetIcon';
import { FaucetToken } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';

const CoreFaucet = () => {
  const [verified, setVerified] = useState(false);

  const { isConnected, address } = useAccount();
  const [token, setToken] = useState<FaucetToken>(FaucetToken.ETH);

  return (
    <>
      <div className='mt-8 flex max-w-full flex-col justify-center gap-2 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[496px]'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <FaucetIcon />
          <div className='font-lufga text-lg font-extrabold uppercase'>
            Get Testnet Tokens
          </div>
          <div className='font-lufga text-sm font-medium'>
            You can request testnet tokens only once per day to ensure a
            sufficient balance for all users.
          </div>
        </div>
        <Divider />
        <div className='text-sm font-medium uppercase text-gray-800 max-md:max-w-full'>
          Select a Token
        </div>
        <label
          htmlFor='tokenInput'
          className='flex gap-2.5 whitespace-nowrap rounded-lg border border-solid border-neutral-700 px-3 py-2.5 text-sm text-white max-md:flex-wrap md:justify-between'
        >
          <select
            id='tokenInput'
            name='tokenInput'
            className='my-auto h-full flex-1 border-none text-gray-800 outline-none'
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

        {isConnected && (
          <>
            <div className='text-sm font-medium uppercase leading-5 max-md:max-w-full'>
              Your Address
            </div>
            <label
              htmlFor='walletAddressInput'
              className='flex gap-2.5 whitespace-nowrap rounded-lg border border-solid border-neutral-700 bg-gray-50 px-3 py-3 text-sm max-md:flex-wrap md:justify-between'
            >
              <input
                type='text'
                disabled
                id='walletAddressInput'
                name='walletAddressInput'
                className='text-gray-60 my-auto h-full flex-1 border-none outline-none'
                value={address}
              />
            </label>
          </>
        )}
        <CustomConnectButton
          verified={verified}
          walletAddress={address}
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

const Divider = () => (
  <div
    className='h-px max-md:max-w-full'
    style={{ backgroundColor: '#E4E2DF' }}
  />
);
