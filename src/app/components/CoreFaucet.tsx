'use client';

import { FC, ReactElement, useState } from 'react';

import { Turnstile } from '@marsidev/react-turnstile';

import { FaucetIcon } from '@/app/icons/FaucetIcon';
import { FaucetTokenType, FaucetToken } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';
import { Divider } from '@/app/components/Divider';
import { TextField } from '@/app/components/TextField';
import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { UsdcIcon } from '@/app/icons/UsdcIcon';
import { EthIcon } from '@/app/icons/EthIcon';
import { DaiIcon } from '@/app/icons/DaiIcon';
import { UsdtIcon } from '@/app/icons/UsdtIcon';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import { useBackdoorSearchParams } from '@/app/hooks/useBackdoorSearchParams';
import { config } from '@/app/config';
import { tokenRadioCardSelected } from '@/app/analytics';
import { GoonIcon } from '../icons/GoonIcon';

const CoreFaucet: FC = () => {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<FaucetTokenType>(FaucetToken.ETH);

  const bypassCloudflareTurnstile = config.enableBypassCloudflareTurnstile;
  //  const { bypassCloudflareTurnstile } = useBackdoorSearchParams();
  const { isConnected, address } = useFaucetWallet();

  return (
    <div className='mt-8 flex max-w-full flex-col justify-center gap-4 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[496px]'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <FaucetIcon />
        <div className='flex flex-col items-center'>
          <div className='font-lufga text-2xl font-extrabold uppercase'>
            Get Testnet Tokens
          </div>
          <div className='max-w-[280px] font-lufga font-medium sm:max-w-[340px]'>
            You can get testnet gas every 10 minutes and other tokens every 2
            hours to ensure a smooth experience for all users.
          </div>
        </div>
      </div>
      <Divider />
      <RadioCardList
        label={`${Object.values(FaucetToken).length > 1 ? 'Select a' : ''} Token`}
        value={token}
        onChange={(token) => {
          setToken(token);
          tokenRadioCardSelected(token);
        }}
      >
        {
          ('ETH' in FaucetToken && (
            <RadioCard
              image={<EthIcon />}
              value={FaucetToken.ETH}
              label='ETH'
              description='Plume Testnet Ether'
              data-testid='eth-radio-card'
            />
          )) as ReactElement
        }
        {
          ('USDC' in FaucetToken && (
            <RadioCard
              image={<UsdcIcon />}
              value={FaucetToken.USDC}
              label='USDC'
              description='Testnet USD Coin'
              data-testid='usdc-radio-card'
            />
          )) as ReactElement
        }
        {
          ('GOON' in FaucetToken && (
            <RadioCard
              image={<GoonIcon />}
              value={FaucetToken.GOON}
              label='GOON'
              description='Goon Testnet Token'
              data-testid='goon-radio-card'
            />
          )) as ReactElement
        }
        {
          ('DAI' in FaucetToken && (
            <RadioCard
              image={<DaiIcon />}
              value={FaucetToken.DAI}
              label='DAI'
              description='Testnet DAI Stablecoin'
              data-testid='dai-radio-card'
            />
          )) as ReactElement
        }
        {
          ('USDT' in FaucetToken && (
            <RadioCard
              image={<UsdtIcon />}
              value={FaucetToken.USDT}
              label='USDT'
              description='Testnet Tether USD'
              data-testid='usdt-radio-card'
            />
          )) as ReactElement
        }
      </RadioCardList>
      {isConnected && (
        <TextField label='Your Address' value={address} disabled />
      )}
      <CustomConnectButton
        verified={verified || bypassCloudflareTurnstile}
        walletAddress={address}
        token={token}
      />
      {!bypassCloudflareTurnstile && (
        <Turnstile
          options={{
            theme: 'light',
          }}
          className='mx-auto flex items-center justify-center'
          siteKey={config.cloudflareTurnstileSiteKey}
          onSuccess={() => setVerified(true)}
          onExpire={() => setVerified(false)}
          onError={() => setVerified(false)}
        />
      )}
    </div>
  );
};

export default CoreFaucet;
