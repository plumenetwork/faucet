'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Divider } from '@/app/components/Divider';
import { config } from '@/app/config';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import Image from 'next/image';
import bitgetLogo from '../assets/bitget.png';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import WalletIcon from '../assets/wallet.png';
import dynamic from 'next/dynamic';
import GoonLoadingAnimation from './Goon Loading Small.json';
import GreenTickBox from '../assets/GreenTickBox.png';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { toast } from './ui/use-toast';

const sendLinkRequest = async ({
  plumeAddress,
  bitgetAddress,
  messsage,
  signature,
}: {
  plumeAddress: string;
  bitgetAddress: string;
  messsage: string;
  signature: string;
}) => {
  return fetch(`${config.apiUrl}/bitget`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plumeAddress: plumeAddress.toLowerCase(),
      bitgetAddress: bitgetAddress.toLowerCase(),
      messsage,
      signature,
    })
  }).then(async (resp) =>  {
    const data = await resp.json();
    if(data.code === 404) {
      return { verified: false };
    }
    return data;
  }).catch((error) => {
    throw error;
  });
};

const getEligibility = async (address: string) => {
  return fetch(`${config.apiUrl}/bitget/${address}`, {
      method: 'GET',
    }).then(async (resp) =>  {
      const data = await resp.json();
      if(data.code === 404) {
        return { address, points: 0 };
      }
      return data;
    }).catch((error) => {
      return { address, error: error.message };
    });
};

const PlumeAddress = ({
  plumeAddress,
  setPlumeAddress,
}: {
  plumeAddress?: string;
  setPlumeAddress: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <input
      className='disabled:bg-gray-[#C7C6C3] rounded-md border-2 p-4 placeholder:font-lufga placeholder:text-[#C7C6C3]'
      disabled={false}
      placeholder='Plume Wallet Address'
      value={plumeAddress}
      onChange={(e) => {
        setPlumeAddress(e.target.value);
      }}
    />
  );
};

const ClaimMiles = ({
  claimFunction,
  isClaimDisabled,
}: {
  claimFunction: () => {};
  isClaimDisabled: boolean;
}) => {
  return (
    <button
      onClick={claimFunction}
      disabled={isClaimDisabled}
      className='flex w-full items-center justify-center space-x-2 rounded-md bg-black px-4 py-3 text-white disabled:bg-[#F1F0EE] disabled:text-[#C7C6C3]'
    >
      Claim Miles
    </button>
  );
};

const BitGetWalletConnect = ({
  isConnected,
  address,  
}: {
  isConnected: boolean;
  address: Address | undefined;
}) => {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) {
    return (
      <button
        onClick={() => openConnectModal && openConnectModal()}
        className='flex w-full items-center justify-center space-x-2 rounded-md bg-black px-4 py-3 text-white'
      >
        <Image src={bitgetLogo} className='size-8' alt='bitget logo' />
        Connect Bitget Wallet
      </button>
    );
  }
  if (isConnected) {
    return (
      <div className='flex max-w-full justify-between'>
        <div className='flex w-1/2 flex-row items-center justify-center gap-2'>
          <Image height={20} src={WalletIcon} alt='wallet icon' />
          <p className='truncate'>{address}</p>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => disconnect()}
            className='whitespace-nowrap rounded-lg bg-[#F1F0EE] px-3 py-2 text-sm'
          >
            Disconnect
          </button>
        </div>        
      </div>
    );
  }
};

const failureToast = () => {
  return toast({
    title: 'Oops! Something went wrong',
    description: (
      <div className='flex flex-row text-sm text-gray-600'>
        We were unable to claim your miles. Please make sure you entered your Plume wallet address and have not already claimed.
      </div>
    ),
    variant: 'fail',
    duration: 10000,
  });
};

const CoreFaucet: FC = () => {
  const [claimingState, setClaimingState] = useState<
    'initial' | 'claiming' | 'complete'
  >('initial');
  const { isConnected, address } = useAccount();
  const [plumeAddress, setPlumeAddress] = useState<string>('');

  const { mutate: linkRequestMutate } = useMutation({
    mutationFn: sendLinkRequest,
    onMutate: () => {
      console.log('onMutate');
      setClaimingState('claiming');
    },
    onSuccess: (data) => {
      console.log('onSuccess', data);
      if(data?.verified) {
      setClaimingState('complete');
      } else {
        setClaimingState('initial');
        failureToast();
      }
    },
    onError: (e) => {
      console.log('onError', e);
      setClaimingState('initial');
      failureToast();
    },
  });

  const { data: eligibilityRequest } = useQuery({
    queryKey: ['getEligibility', address],
    queryFn: () => getEligibility(address as string),
    enabled: !!address,
  });

  const miles = eligibilityRequest?.points ?? 0;

  const { signMessage } = useSignMessage();

  const handleSignMessage = async () => {
    if (!address || plumeAddress.trim() === '') return;

    const message = `I confirm ${plumeAddress.toLowerCase()} owns ${address.toLowerCase()}`;
    try {
      await signMessage(
        { message },
        {
          onSuccess: (signature, variables) => {
            linkRequestMutate({
              plumeAddress: plumeAddress,
              bitgetAddress: address,
              messsage: message,
              signature,
            });
          },
        }
      );
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  const isEligible = eligibilityRequest ? eligibilityRequest.points > 0 : false;
  const showNotEligible = eligibilityRequest && !eligibilityRequest.error && eligibilityRequest.points <= 0;
  const isPlumeAddressValid =
    plumeAddress?.length === 42 && plumeAddress?.startsWith('0x');
  const isClaimDisabled = !isEligible || !isPlumeAddressValid || !address;

  switch (claimingState) {
    case 'initial':
      return (
        <div className='mt-4 flex max-w-full flex-col justify-center gap-2 rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 md:w-[560px]'>
          <div className='flex flex-col text-left'>
            <p className='font-lufga font-bold'>Who is Eligible?</p>
          </div>
          <p className='font-lufga font-medium'>
            All users who participated in Plume x Bitget{' '}
            <a
              className='text-blue-600'
              href='https://medium.com/@plumenetwork/earn-rewards-with-plume-x-bitget-task2get-campaign-96bafb6a7d3d'
            >
              Task2Get
            </a>{' '}
            campaign from July 2nd to July 16th
          </p>
          <Divider />
          <span className='font-lufga font-normal capitalize text-gray-400'>
            STEP 1
          </span>
          <p className='font-semi font-lufga'>Connect Your Bitget Wallet</p>
          <BitGetWalletConnect
            isConnected={isConnected}
            address={address}
          />
          <div className='flex items-center space-x-2'>
          {isEligible && (
            <span className='whitespace-nowrap rounded-full bg-[#DEF7EC] px-3 py-1 text-sm text-[#0E9F6E]'>
              You are Eligible
            </span>
          )}
          </div>
          {!!eligibilityRequest && isEligible && <>
            <span className='font-lufga font-normal capitalize text-gray-400'>
              STEP 2
            </span>
            <p className='font-semi font-lufga'>
              Enter Your Plume Wallet Address
            </p>
            <PlumeAddress
              plumeAddress={plumeAddress}
              setPlumeAddress={setPlumeAddress}
            />
            <span className='font-lufga font-normal capitalize text-gray-400'>
              STEP 3
            </span>
            <p className='font-semi font-lufga'>Claim Miles</p>
            <ClaimMiles
              claimFunction={handleSignMessage}
              isClaimDisabled={isClaimDisabled}
            />
          </>}
          {showNotEligible && 
          <span className='whitespace-nowrap rounded-md bg-[#FEEBEB] px-3 py-3 text-sm text-[#F43B3A] text-center'>
          You are not eligible
        </span>}
        </div>
      );
    case 'claiming':
      const Lottie = dynamic(
        () => import('react-lottie-player/dist/LottiePlayerLight'),
        { ssr: false }
      );
      return (
        <div className='mt-4 flex max-w-full flex-col justify-center gap-2 overflow-hidden rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 text-center md:w-[560px]'>
          <Lottie
            loop={true}
            className='h-96 w-full'
            play
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            animationData={GoonLoadingAnimation}
            style={{
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
          <p className='font-lufga text-4xl font-bold'>Claiming Miles...</p>
          <p className='font-lufga text-gray-500'>
            Please wait, it might take up to 1 minute
          </p>
        </div>
      );
    case 'complete':
      return (
        <div className='mt-4 flex max-w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-solid border-gray-200 bg-neutral-50 px-5 py-5 text-center md:w-[560px]'>
          <Image
            src={GreenTickBox}
            alt='green tick box'
            className='h-20 w-20'
          />
          <p className='font-lufga text-4xl font-bold'>Miles Claimed</p>
          <p className='font-lufga text-4xl font-bold text-[#31C48D]'>
            +{miles.toLocaleString()} MILES
          </p>
          <p className='font-lufga text-gray-500'>
            Thank you for participating!
          </p>
          <button className='flex w-full items-center justify-center space-x-2 rounded-md bg-black px-4 py-3 text-white disabled:text-[#C7C6C3]'>
            Claim your miles on Plume Testnet
          </button>
        </div>
      );
  }
};

export default CoreFaucet;
