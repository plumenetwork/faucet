import { FaucetToken, FaucetTokenType } from '@/app/lib/types';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConfig, usePublicClient, useWriteContract } from 'wagmi';
import { getBalance, waitForTransactionReceipt } from '@wagmi/core';
import { encodePacked, keccak256 } from 'viem';
import { useToast } from './ui/use-toast';
import { cn } from '@/app/lib/utils';
import { ButtonHTMLAttributes, FC, useState } from 'react';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import faucetABI from '@/app/abi/faucet';
import {
  connectWalletButtonClicked,
  getTokensButtonClicked,
  getTokensError,
  getTokensSuccess,
} from '@/app/analytics';
import { config } from '@/app/config';
import * as Sentry from '@sentry/nextjs';

type SignedData = {
  tokenDrip: string;
  token: FaucetTokenType;
  salt: `0x${string}`;
  signature: `0x${string}`;
  walletAddress: `0x${string}`;
};

export const CustomConnectButton = ({
  verified,
  walletAddress,
  token = FaucetToken.ETH,
}: {
  verified: boolean;
  walletAddress: string | undefined;
  token: FaucetTokenType;
}) => {
  const client = usePublicClient();
  const { writeContract } = useWriteContract();
  const wagmiConfig = useConfig();
  const { toast } = useToast();
  const { isPlumeTestnet } = useFaucetWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [signedData, setSignedData] = useState<SignedData | null>(null);

  const handleClaimTokens = async () => {
    try {
      setIsLoading(true);
      submitToast();

      const data: SignedData =
        token === signedData?.token
          ? signedData
          : await fetch('api/faucet', {
              method: 'POST',
              headers: { ['Content-Type']: 'application/json' },
              body: JSON.stringify({ walletAddress, token }),
            }).then(async (res) => {
              if (res.status >= 200 && res.status < 300) {
                return res.json();
              } else if (res.status === 429) {
                rateLimitToast(token);
              } else {
                failureToast();
              }
            });

      if (!data) {
        setIsLoading(false);
        return;
      }

      if (data.tokenDrip) {
        // try to refresh wallet balance
        // @ts-ignore
        await waitForTransactionReceipt(wagmiConfig, { hash: data.tokenDrip });
        await new Promise((resolve) => setTimeout(resolve, 100));
        // @ts-ignore
        await getBalance(wagmiConfig, { address: walletAddress });
        await new Promise((resolve) => setTimeout(resolve, 500));

        successToast(FaucetToken.ETH);
        setSignedData({ ...data, tokenDrip: '' });
        setIsLoading(false);

        return;
      }

      const { token: tokenName, salt, signature, walletAddress: wallet } = data;

      // msg.sender, token, salt
      const nonce = keccak256(
        encodePacked(['address', 'string', 'bytes32'], [wallet, token, salt])
      );

      const isNonceUsed = await client?.readContract({
        address: config.faucetContractAddress,
        abi: faucetABI,
        functionName: 'isNonceUsed',
        args: [nonce],
      });

      if (isNonceUsed || wallet !== walletAddress) {
        rateLimitToast(tokenName as FaucetTokenType);
        setIsLoading(false);
        setSignedData(null);
        return;
      }

      writeContract(
        {
          address: config.faucetContractAddress,
          abi: faucetABI,
          functionName: 'getToken',
          args: [tokenName, salt, signature],
        },
        {
          onSuccess: () => {
            successToast(tokenName as FaucetTokenType);
            setIsLoading(false);
            setSignedData(null);
            getTokensSuccess();
          },
          onError: (error) => {
            console.error(error);
            if (Math.random() < 0.05) {
              Sentry.captureException(error);
            }

            if (error.message.includes('User rejected')) {
              rejectedToast();
            } else {
              getTokensError();
              failureToast();
            }
            setIsLoading(false);
            setSignedData(null);
          },
        }
      );
    } catch (error) {
      console.error(error);
      failureToast();
      setIsLoading(false);
    }
  };

  const submitToast = () => {
    return toast({
      title: 'Working on it',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          We are getting your tokens. This may take a few seconds.
        </div>
      ),
      variant: 'default',
      duration: 10000,
    });
  };

  const successToast = (tokenName: FaucetTokenType) => {
    return toast({
      title: 'Mission accomplished',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          You&#39;ll receive
          {tokenName === FaucetToken.ETH ? ' 0.001 ' : ' 1 '}
          testnet {tokenName} in your wallet within a minute.
        </div>
      ),
      variant: 'pass',
      duration: 10000,
    });
  };

  const rateLimitToast = (tokenName: FaucetTokenType) => {
    return toast({
      title: 'Whoosh! Slow down!',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Sorry, you can only claim
          {tokenName === FaucetToken.ETH
            ? ' free testnet gas '
            : ` ${tokenName} tokens `}
          once every
          {tokenName === FaucetToken.ETH ? ' hour.' : ' 2 hours.'}
        </div>
      ),
      variant: 'fail',
      duration: 10000,
    });
  };

  const rejectedToast = () => {
    return toast({
      title: 'You rejected the transaction',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Please try again. Don&#39;t worry, this doesn&#39;t count against your
          rate limit.
        </div>
      ),
      variant: 'fail',
      duration: 10000,
    });
  };

  const failureToast = () => {
    return toast({
      title: 'Oops! Something went wrong',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Our system is under heavy load. Please try again later.
        </div>
      ),
      variant: 'fail',
      duration: 10000,
    });
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain && walletAddress != null;

        return (
          <div
            className='flex max-w-full cursor-pointer flex-col items-center gap-2 rounded-lg py-2 text-base font-semibold leading-6 text-zinc-800'
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {connected ? (
              <Button
                onClick={() => {
                  handleClaimTokens();
                  getTokensButtonClicked();
                }}
                disabled={!verified || !isPlumeTestnet}
                isLoading={isLoading}
                data-testid='get-tokens-button'
              >
                {signedData ? 'Get More Tokens and Miles' : 'Get Tokens'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  openConnectModal();
                  connectWalletButtonClicked();
                }}
                disabled={!verified}
                data-testid='connect-wallet-button'
              >
                Connect Wallet
              </Button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: FC<ButtonProps> = ({
  disabled,
  isLoading = false,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        disabled ? 'opacity-50' : 'opacity-100',
        disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer',
        isLoading && 'animate-pulse',
        'bg-[#ebbe49] hover:bg-[#E3A810]',
        'shadow-[0_0_0_2px_rgba(255,255,255,0.8)_inset,6px_6px_0_0] active:shadow-none disabled:active:shadow-[0_0_0_2px_rgba(255,255,255,0.8)_inset,6px_6px_0_0]',
        'w-full rounded-xl border-2 border-gray-800 px-10 py-3 text-center font-lufga font-bold text-gray-800'
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
};
