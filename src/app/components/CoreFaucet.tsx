'use client';

import { FC, ReactElement, useState } from 'react';

import { Turnstile } from '@marsidev/react-turnstile';
import { watchAsset } from 'viem/actions';

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
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<FaucetTokenType>(FaucetToken.ETH);
  const { toast } = useToast();

  const bypassCloudflareTurnstile = config.enableBypassCloudflareTurnstile;
  //  const { bypassCloudflareTurnstile } = useBackdoorSearchParams();
  const { isConnected, address } = useFaucetWallet();

  return (
    <div className='mt-4 flex max-w-full flex-col justify-center gap-1 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[496px]'>
      <div className='flex flex-col text-left'>
      <p className='font-lufga font-bold'>Who is Eligible?</p>
      </div>
      <p className='font-lufga font-medium'>All users who participated in Plume x Bitget <a className="text-blue-600" href="https://medium.com/@plumenetwork/earn-rewards-with-plume-x-bitget-task2get-campaign-96bafb6a7d3d">Task2Get</a> campaign from July 2nd to July 16th</p>
      <Divider />
      <span className="font-lufga text-gray-400 capitalize font-normal">STEP 1</span>
      <p className="font-lufga font-semi">Connect Your Bitget Wallet</p>
      <span className="font-lufga text-gray-400 capitalize font-normal">STEP 2</span>
      <p className="font-lufga font-semi">Enter Your Plume Wallet Address</p>
      <span className="font-lufga text-gray-400 capitalize font-normal">STEP 3</span>
      <p className="font-lufga font-semi">Claim Miles</p>

    </div>
  );
};

export default CoreFaucet;
