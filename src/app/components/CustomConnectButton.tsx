import { FaucetToken } from '@/app/lib/types';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConfig, useWriteContract } from 'wagmi';
import { getBalance} from "@wagmi/core";
import { useToast } from './ui/use-toast';
import { cn } from '@/app/lib/utils';
import { ButtonHTMLAttributes, FC, useState } from 'react';
import { useFaucetWallet } from '@/app/hooks/useFaucetWallet';
import Faucet from '@/app/abi/Faucet.json';
import {
  connectWalletButtonClicked,
  getTokensButtonClicked,
} from '@/app/analytics';

type SignedData = {
  tokenDrip: boolean;
  token: string;
  salt: string;
  signature: string;
};

export const CustomConnectButton = ({
  verified,
  walletAddress,
  token = FaucetToken.ETH,
}: {
  verified: boolean;
  walletAddress: string | undefined;
  token: FaucetToken | undefined;
}) => {
  const { writeContract } = useWriteContract();
  const config = useConfig();
  const { toast } = useToast();
  const { isPlumeTestnet } = useFaucetWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [signedData, setSignedData] = useState<SignedData | null>(null);

  const handleClaimTokens = async () => {
    try {
      setIsLoading(true);
      submitToast();

      const data: SignedData = signedData ||
        await fetch('api/faucet', {
          method: 'POST',
          headers: { ['Content-Type']: 'application/json' },
          body: JSON.stringify({ walletAddress, token }),
        }).then(async (res) => {
          if (res.status === 200) {
            return res.json();
          } else if (res.status === 429) {
            rateLimitToast();
          } else {
            failureToast();
          }
        });

      if (!data) {
        setIsLoading(false);
        return;
      }

      if (data.tokenDrip) {
        successToast();
        setSignedData({...data, tokenDrip: false});
        setIsLoading(false);

        // try to refresh wallet balance
        // @ts-ignore
        await getBalance(config, { address: walletAddress });
        return;
      }

      const { token: tokenName, salt, signature } = data;

      writeContract(
        {
          address: process.env
            .NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as `0x${string}`,
          abi: Faucet.abi,
          functionName: 'getToken',
          args: [tokenName, salt, signature],
        },
        {
          onSuccess: () => {
            successToast();
            setIsLoading(false);
            setSignedData(null);
          },
          onError: (error) => {
            console.error(error);
            if (!error.message.includes('User rejected')) {
              failureToast();
            }
            setIsLoading(false);
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

  const successToast = () => {
    return toast({
      title: 'Mission accomplished',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          You&apos;ll receive
          {token === FaucetToken.ETH ? ' 0.001 ' : ' 1000 '}
          testnet {token} in your wallet within a minute.
        </div>
      ),
      variant: 'pass',
      duration: 10000,
    });
  };

  const rateLimitToast = () => {
    return toast({
      title: 'Whoosh! Slow down!',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Sorry, you can only claim tokens once every 2 hours.
        </div>
      ),
      variant: 'fail',
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
                { signedData
                  ? "Get Some More Tokens"
                  : "Get Tokens"
                }
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
