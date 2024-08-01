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
import { useAccount, useConnect } from 'wagmi';
import { useWagmiConfig } from '../hooks/useWagmiConfig';
import { getConnectorClient } from '@wagmi/core';
import { useToast } from './ui/use-toast';
import { Address } from 'viem';
import Image from 'next/image';
import bitgetLogo from '../assets/bitget.png'
import { } from 'wagmi/connectors'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import WalletIcon from '../assets/wallet.png'
import dynamic from 'next/dynamic';
import GoonLoadingAnimation from './Goon Loading Small.json'

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

const PlumeAddress = () => {
 return (<input className='p-4 rounded-md border-2 disabled:bg-gray-[#C7C6C3] placeholder:font-lufga placeholder:text-[#C7C6C3]' disabled={true} placeholder='Plume Wallet Address' />)
}

const ClaimMiles = () => {
return  (<button disabled={false} className='w-full disabled:bg-[#F1F0EE] bg-black disabled:text-[#C7C6C3] text-white rounded-md flex items-center justify-center space-x-2 py-3 px-4'>Claim Miles</button>)
}

const BitGetWalletConnect = () => {

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal()
  const [isEligible, setIsEligible] = useState(false)



  if(false) {
    return (<button onClick={() => openConnectModal && openConnectModal()} className='w-full bg-black text-white rounded-md flex items-center justify-center space-x-2 py-3 px-4'>
      <Image src={bitgetLogo} className='size-8'  alt='bitget logo'/>
       Connect Bitget Wallet</button>)
  }

  const tempAddress = '0x82C5F5534eaec8FE2EBE0E6dEDd4F35330E82759'

  if(true){
    return (
      <div className='flex flex-row max-w-full justify-between'>
          <div className='flex items-center justify-center flex-row w-1/2 gap-2'>
            <Image height={20} src={WalletIcon} alt='wallet icon' />
            <p className='text-ellipsis'>{tempAddress}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEligible ? 
          (<span className="bg-[#DEF7EC] text-[#0E9F6E] px-3 py-1 rounded-full text-sm whitespace-nowrap">
            You are Eligible
          </span>) 
          : 
          (<span className="bg-[#FEEBEB] text-[#F43B3A] px-3 py-1 rounded-full text-sm whitespace-nowrap">
          Not Eligible
        </span>)}
        <button className="bg-[#F1F0EE] px-3 py-2 rounded-lg text-sm whitespace-nowrap">
          Disconnect
        </button>
      </div>
      </div>
    )
  }

}

const CoreFaucet: FC = () => {
  const [claimingState, setClaimingState] = useState<'initial' | 'claiming' | 'complete'>('claiming')

  const { wagmiConfig } = useWagmiConfig();
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<FaucetTokenType>(FaucetToken.ETH);
  const { toast } = useToast();

  const bypassCloudflareTurnstile = config.enableBypassCloudflareTurnstile;
  //  const { bypassCloudflareTurnstile } = useBackdoorSearchParams();
  const { isConnected, address } = useFaucetWallet();


  switch(claimingState) {
    case 'initial':
      return (
        <div className='mt-4 flex max-w-full flex-col justify-center gap-2 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[560px]'>
          <div className='flex flex-col text-left'>
          <p className='font-lufga font-bold'>Who is Eligible?</p>
          </div>
          <p className='font-lufga font-medium'>All users who participated in Plume x Bitget <a className="text-blue-600" href="https://medium.com/@plumenetwork/earn-rewards-with-plume-x-bitget-task2get-campaign-96bafb6a7d3d">Task2Get</a> campaign from July 2nd to July 16th</p>
          <Divider />
          <span className="font-lufga text-gray-400 capitalize font-normal">STEP 1</span>
          <p className="font-lufga font-semi">Connect Your Bitget Wallet</p>
          <BitGetWalletConnect/>
          <span className="font-lufga text-gray-400 capitalize font-normal">STEP 2</span>
          <p className="font-lufga font-semi">Enter Your Plume Wallet Address</p>
          <PlumeAddress/>
          <span className="font-lufga text-gray-400 capitalize font-normal">STEP 3</span>
          <p className="font-lufga font-semi">Claim Miles</p>
          <ClaimMiles/>
         
        </div>
      );
    case 'claiming': 
    const Lottie = dynamic(
      () => import('react-lottie-player/dist/LottiePlayerLight'),
      { ssr: false }
    );    
     return (
     <div className='mt-4 overflow-hidden flex max-w-full flex-col text-center justify-center gap-2 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[560px]'>
            <Lottie
              loop={true}
              className='w-full h-96'
              play
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              animationData={GoonLoadingAnimation}
              style={{
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            />
                <p className='font-lufga font-bold text-4xl'>Claiming Miles...</p>
                <p className='font-lufga text-gray-500'>Please wait, it might take up to 1 minute</p>
    </div>
    );
    case 'complete': 
    return (<>Complete</>);
  }
};

export default CoreFaucet;
