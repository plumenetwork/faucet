import { FaucetToken } from '@/app/lib/types';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useToast } from './ui/use-toast';
import { cn } from '@/app/lib/utils';
import { FC, ReactNode } from 'react';

export const CustomConnectButton = (props: {
  verified: boolean;
  walletAddress: string | undefined;
  token: FaucetToken | undefined;
}) => {
  const { toast } = useToast();
  const { verified, walletAddress, token = FaucetToken.ETH } = props;

  const handleClaimTokens = () => {
    fetch('api/faucet', {
      method: 'POST',
      headers: { ['Content-Type']: 'application/json' },
      body: JSON.stringify({ walletAddress, token }),
    }).then((res) => {
      if (res.status === 200) {
        successToast();
      } else if (res.status === 429) {
        rateLimitToast();
      } else {
        failureToast();
      }
    });
  };

  const successToast = () => {
    return toast({
      title: 'Request Succeeded',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          You&apos;ll receive
          {token === FaucetToken.ETH ? ' 0.01 ' : ' 100,000 '}
          testnet {token} in your wallet within a minute.
        </div>
      ),
      variant: 'pass',
    });
  };

  const rateLimitToast = () => {
    return toast({
      title: 'Rate Limit Exceeded',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Sorry, you can only claim tokens once a day.
        </div>
      ),
      variant: 'fail',
    });
  };

  const failureToast = () => {
    return toast({
      title: 'Request Failed',
      description: (
        <div className='flex flex-row text-sm text-gray-600'>
          Sorry, your request failed. The faucet may be temporarily out of
          tokens.
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
              <Button onClick={handleClaimTokens} disabled={!verified}>
                Get Tokens
              </Button>
            ) : (
              <Button onClick={openConnectModal} disabled={!verified}>
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

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

const Button: FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        disabled ? 'opacity-50' : 'opacity-100',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        'bg-[#ebbe49] hover:bg-[#E3A810]',
        'shadow-[0_0_0_2px_rgba(255,255,255,0.8)_inset,6px_6px_0_0] active:shadow-none',
        'w-full rounded-xl border-2 border-gray-800 px-10 py-3 text-center font-lufga font-bold text-gray-800'
      )}
    >
      {children}
    </button>
  );
};
