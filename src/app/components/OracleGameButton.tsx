import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'bignumber.js';
import { useWriteContract } from 'wagmi';
import { abi } from '../lib/OracleGameABI';
import { useToast } from './ui/use-toast';

export const OracleGameButton = (props: {
  guess: boolean;
  verified: boolean;
  walletAddress: string | undefined;
  setGuessSuccessHash: (hash: string) => void;
}) => {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();
  const { guess, verified, walletAddress, setGuessSuccessHash } = props;

  const handleClaimTokens = () => {
    fetch("api/faucet", {
      method: "POST",
      headers: { ["Content-Type"]: "application/json" },
      body: JSON.stringify({ walletAddress }),
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

  const guessPrice = () => {
    try {
      const priceInput = document.getElementById('priceGuess') as HTMLInputElement;
      const price = BigNumber(10).pow(18).multipliedBy(Number(priceInput.value)).integerValue();
      writeContract({
        address: process.env.NEXT_PUBLIC_ORACLE_GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "guessPairPrice",
        args: [price.toFixed()],
      }, {
        onSuccess: (hash) => {
          setGuessSuccessHash(String(hash));
        }, onError: (error) => {
          console.error(error);
          guessFailureToast();
        }
      });
    } catch (error) {
      console.error(error);
      guessFailureToast();
    }
  };

  const successToast = () => {
    return toast({
      title: "Request Succeeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          You&apos;ll receive 0.00025 testnet ETH in your wallet within a
          minute.
        </div>
      ),
      variant: "pass",
    });
  };

  const rateLimitToast = () => {
    return toast({
      title: "Rate Limit Exceeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          Please wait at least ten minutes between requests.
        </div>
      ),
      variant: "fail",
    });
  };

  const failureToast = () => {
    return toast({
      title: "Request Failed",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          Sorry, your request failed. The faucet may be temporarily out of
          tokens.
        </div>
      ),
      variant: "fail",
    });
  };

  const guessFailureToast = () => {
    return toast({
      title: "Request Failed",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          Sorry, your request failed. Please make sure your account has enough
          funds, and try again later.
        </div>
      ),
      variant: "fail",
    });
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain && walletAddress != null;

        return (
          <div
            className="flex flex-col gap-2 cursor-pointer items-center py-2 mt-4 text-base font-semibold leading-6 rounded-lg text-zinc-800 max-w-full"
            {...(!mounted && {
              "aria-hidden": true,
              "style": {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {connected ? (
              <>
                <button
                  onClick={handleClaimTokens}
                  disabled={!verified}
                  className="solid-button text-center text-white rounded-md px-10 py-3 w-full"
                  type="button"
                  style={{
                    opacity: !verified ? 0.5 : 1,
                    cursor: !verified ? "not-allowed" : "pointer",
                  }}
                >
                  Get Testnet Gas Tokens
                </button>
                {guess && (
                  <button
                    onClick={guessPrice}
                    disabled={!verified}
                    className="solid-button text-center text-white rounded-md px-10 py-3 w-full"
                    type="button"
                    style={{
                      opacity: !verified ? 0.5 : 1,
                      cursor: !verified ? "not-allowed" : "pointer",
                    }}
                  >
                    Guess Price
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={openConnectModal}
                className="solid-button text-center rounded-md px-10 py-3 w-full text-white"
                type="button"
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

export default OracleGameButton;
