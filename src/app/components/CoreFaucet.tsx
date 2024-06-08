'use client';

import { FC, useState } from 'react';

import { Turnstile } from '@marsidev/react-turnstile';

import { FaucetIcon } from '@/app/icons/FaucetIcon';
import { FaucetToken } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';
import { Divider } from '@/app/components/Divider';
import { TextField } from '@/app/components/TextField';
import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { UsdcIcon } from '@/app/icons/UsdcIcon';
import { EthIcon } from '@/app/icons/EthIcon';
import { DaiIcon } from '@/app/icons/DaiIcon';
import { UsdtIcon } from '@/app/icons/UsdtIcon';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import { useCloudflareTurnstile } from '@/app/hooks/useCloudflareTurnstile';

const CoreFaucet: FC = () => {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<FaucetToken>(FaucetToken.ETH);

  const { cloudflareTurnstileSiteKey } = useCloudflareTurnstile();
  const { isConnected, address } = useFaucetWallet();

  return (
    <div className='mt-8 flex max-w-full flex-col justify-center gap-4 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[496px]'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <FaucetIcon />
        <div>
          <div className='font-lufga text-2xl font-extrabold uppercase'>
            Get Testnet Tokens
          </div>
          <div className='font-lufga font-medium'>
            You can request testnet tokens only once per day to ensure a
            sufficient balance for all users.
          </div>
        </div>
      </div>
      <Divider />
      <RadioCardList
        label='Select a Token'
        value={token}
        onChange={(token) => setToken(token)}
      >
        <RadioCard
          image={<EthIcon />}
          value={FaucetToken.ETH}
          label='ETH'
          description='Plume Testnet Ether'
          data-testid='eth-radio-card'
        />
        <RadioCard
          image={<UsdcIcon />}
          value={FaucetToken.USDC}
          label='USDC'
          description='Testnet USD Coin'
          data-testid='usdc-radio-card'
        />
        <RadioCard
          image={<DaiIcon />}
          value={FaucetToken.DAI}
          label='DAI'
          description='Testnet DAI Stablecoin'
          data-testid='dai-radio-card'
        />
        <RadioCard
          image={<UsdtIcon />}
          value={FaucetToken.USDT}
          label='USDT'
          description='Testnet Tether USD'
          data-testid='usdt-radio-card'
        />
      </RadioCardList>
      {isConnected && (
        <TextField label='Your Address' value={address} disabled />
      )}
      <CustomConnectButton
        verified={verified}
        walletAddress={address}
        token={token}
      />
      <Turnstile
        options={{
          theme: 'light',
        }}
        className='mx-auto flex items-center justify-center'
        siteKey={cloudflareTurnstileSiteKey}
        onSuccess={() => setVerified(true)}
        onExpire={() => setVerified(false)}
        onError={() => setVerified(false)}
      />
    </div>
  );
};

export default CoreFaucet;
