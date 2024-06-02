import { FaucetToken } from '@/app/lib/types';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useToast } from './ui/use-toast';

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
        <div className='flex flex-row text-sm text-[#D2D6DB]'>
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
        <div className='flex flex-row text-sm text-[#D2D6DB]'>
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
        <div className='flex flex-row text-sm text-[#D2D6DB]'>
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
              <>
                <button
                  onClick={handleClaimTokens}
                  disabled={!verified}
                  className='w-full rounded-xl border-2 border-gray-800 px-10 py-3 text-center font-lufga font-bold text-gray-800'
                  type='button'
                  style={{
                    opacity: !verified ? 0.5 : 1,
                    cursor: !verified ? 'not-allowed' : 'pointer',
                    backgroundColor: '#EBBE49',
                    boxShadow:
                      '0px 0px 0px 2px rgba(255, 255, 255, 0.80) inset, 6px 6px 0px 0px #282828;',
                  }}
                >
                  Get Tokens
                </button>
              </>
            ) : (
              <button
                onClick={openConnectModal}
                className='w-full rounded-xl border-2 border-gray-800 px-10 py-3 text-center font-lufga font-bold text-gray-800'
                type='button'
                style={{
                  backgroundColor: '#EBBE49',
                  boxShadow:
                    '0px 0px 0px 2px rgba(255, 255, 255, 0.80) inset, 6px 6px 0px 0px #282828;',
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
