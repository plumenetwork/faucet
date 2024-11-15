'use client';

import { FC, useRef, useState } from 'react';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { watchAsset } from 'viem/actions';

import Image from 'next/image';
import { FaucetTokenType } from '@/app/lib/types';
import CustomConnectButton from './CustomConnectButton';
import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { EthIcon } from '@/app/icons/EthIcon';
import { PusdIcon } from '@/app/icons/PusdIcon';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import { config } from '@/app/config';
import { tokenRadioCardSelected } from '@/app/analytics';
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
  [FaucetTokenType.pUSD]: {
    address: '0xe644F07B1316f28a7F134998e021eA9f7135F351',
    symbol: 'pUSD',
    decimals: 6,
  },
};

const CoreFaucet: FC = () => {
  const { connector } = useAccount();
  const { wagmiConfig } = useWagmiConfig();
  const [verified, setVerified] = useState<string | null>(null);
  const [token, setToken] = useState<FaucetTokenType>(FaucetTokenType.ETH);
  const turnstileInstanceRef = useRef<TurnstileInstance | null>(null);
  const { toast } = useToast();

  const bypassCloudflareTurnstile = config.enableBypassCloudflareTurnstile;
  const { isConnected, address } = useFaucetWallet();

  return (
    <div className='flex max-w-full flex-col justify-center gap-4 rounded-3xl border border-solid border-[#F0F0F0] bg-white px-5 py-5 md:w-[496px]'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <Image
          alt='Flower icon'
          height={64}
          src='/images/flower-icon.png'
          width={64}
        />
        <div className='flex flex-col items-center'>
          <div className='font-lufga text-2xl font-extrabold'>
            Get devnet tokens
          </div>
          <div className='max-w-[280px] font-lufga font-medium text-[#747474]'>
            Drip tokens to engage with the Plume ecosystem on devnet
          </div>
        </div>
      </div>
      <RadioCardList
        label={`${Object.values(FaucetTokenType).length > 1 ? 'Select a' : ''} Token`}
        value={token}
        onChange={(token) => {
          setToken(token);
          tokenRadioCardSelected(token);
        }}
      >
        <RadioCard
          image={<EthIcon />}
          value={FaucetTokenType.ETH}
          label='ETH'
        />
        <RadioCard
          image={<PusdIcon />}
          value={FaucetTokenType.pUSD}
          label='pUSD'
        />
      </RadioCardList>
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

              await watchAsset(connectorClient, {
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
