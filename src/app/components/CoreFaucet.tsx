'use client';

import { FC, ReactElement, useRef, useState } from 'react';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { watchAsset } from 'viem/actions';

import { FaucetIcon } from '@/app/icons/FaucetIcon';
import { FaucetTokenType, FaucetToken } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';
import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { PIcon } from '@/app/icons/PIcon';
import { UsdcIcon } from '@/app/icons/UsdcIcon';
import { EthIcon } from '@/app/icons/EthIcon';
import { DaiIcon } from '@/app/icons/DaiIcon';
import { UsdtIcon } from '@/app/icons/UsdtIcon';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import { config } from '@/app/config';
import { tokenRadioCardSelected } from '@/app/analytics';
import { GoonIcon } from '../icons/GoonIcon';
import { useAccount } from 'wagmi';
import { useWagmiConfig } from '../hooks/useWagmiConfig';
import { getConnectorClient } from '@wagmi/core';
import { useToast } from './ui/use-toast';
import { Address } from 'viem';

const faucetTokenConfigs: {
  [k in FaucetTokenType]?: {
    address: Address;
    symbol: string;
    decimals: number;
  };
} = {
  [FaucetTokenType.GOON]: {
    address: '0xbA22114ec75f0D55C34A5E5A3cf384484Ad9e733',
    symbol: 'GOON',
    decimals: 18,
  },
};

const CoreFaucet: FC = () => {
  const { connector } = useAccount();
  const { wagmiConfig } = useWagmiConfig();
  const [verified, setVerified] = useState<string | null>(null);
  const [token, setToken] = useState<FaucetTokenType>(FaucetToken.ETH);
  const turnstileInstanceRef = useRef<TurnstileInstance | null>(null);
  const { toast } = useToast();

  const bypassCloudflareTurnstile = config.enableBypassCloudflareTurnstile;
  const { isConnected, address } = useFaucetWallet();

  return (
    <div className='mt-8 flex max-w-full flex-col justify-center gap-4 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[496px]'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <FaucetIcon />
        <div className='flex flex-col items-center'>
          <div className='font-lufga text-2xl font-extrabold uppercase'>
            Get Testnet Tokens
          </div>
          <div className='max-w-[280px] font-lufga font-medium sm:max-w-[400px]'>
            You can get
            {token === FaucetToken.ETH
              ? ' free testnet gas '
              : ` testnet ${token} tokens `}
            once per day to ensure a smooth experience for all users.
          </div>
        </div>
      </div>
      <div className='my-2 h-px bg-[#e4e2df] lg:max-w-full' />
      <RadioCardList
        label={`${Object.values(FaucetToken).length > 1 ? 'Select a' : ''} Token`}
        value={token}
        onChange={(token) => {
          setToken(token);
          tokenRadioCardSelected(token);
        }}
      >
        {
          ('P' in FaucetToken && (
            <RadioCard
              image={<PIcon />}
              value={FaucetToken.P}
              label='P'
              description='Plume Devnet Gas'
              data-testid='p-radio-card'
            />
          )) as ReactElement
        }
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
        <div className='flex flex-col gap-2'>
          <label className='font-lufga text-sm font-semibold uppercase leading-5 max-md:max-w-full'>
            Your Address
          </label>
          <input
            type='text'
            disabled
            className='text-gray-60 my-auto flex h-full truncate rounded-lg border border-neutral-700 bg-gray-50 px-3 py-3 text-sm outline-none disabled:border-gray-200 disabled:bg-stone-100 disabled:text-[#555]'
            value={address}
          />
        </div>
      )}
      <CustomConnectButton
        verified={verified}
        bypassCloudflareTurnstile={bypassCloudflareTurnstile}
        walletAddress={address}
        token={token}
        resetTurnstile={() => turnstileInstanceRef.current?.reset()}
      />
      {!bypassCloudflareTurnstile && (
        <Turnstile
          options={{
            theme: 'light',
          }}
          ref={(instance) => {
            if (instance) {
              turnstileInstanceRef.current = instance;
            }
          }}
          className='mx-auto flex items-center justify-center'
          siteKey={config.cloudflareTurnstileSiteKey}
          onSuccess={setVerified}
          onExpire={() => setVerified(null)}
          onError={() => setVerified(null)}
        />
      )}
      {isConnected && faucetTokenConfigs[token] && (
        <button
          className='text-blue-500'
          onClick={async () => {
            try {
              // @ts-ignore
              const connectorClient = await getConnectorClient(wagmiConfig, {
                connector,
              });

              watchAsset(connectorClient, {
                type: 'ERC20',
                // okay to assert here due to check above
                options: faucetTokenConfigs[token]!,
              });
            } catch (e) {
              toast({
                title: 'Cancelled by user',
                variant: 'fail',
              });
            }
          }}
        >
          Add {token} to your wallet
        </button>
      )}
    </div>
  );
};

export default CoreFaucet;
