import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'bignumber.js';
import { ChangeEvent, useCallback, useState } from 'react';
import { useWriteContract } from 'wagmi';
import { abi } from '../lib/OracleGameABI';
import { useToast } from './ui/use-toast';

export const OracleGameButton = (props: {
  verified: boolean;
  walletAddress: string | undefined;
  setGuessSuccessHash: (hash: string) => void;
}) => {
  const { writeContract } = useWriteContract();
  const { toast } = useToast();
  const { verified, walletAddress, setGuessSuccessHash } = props;
  const [priceGuess, setPriceGuess] = useState('');
  const [bytesProof, setBytesProof] = useState('');

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

  const successToast = useCallback(() => {
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
  }, [toast]);

  const rateLimitToast = useCallback(() => {
    return toast({
      title: "Rate Limit Exceeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          Please wait at least ten minutes between requests.
        </div>
      ),
      variant: "fail",
    });
  }, [toast]);

  const failureToast = useCallback(() => {
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
  }, [toast]);

  const guessFailureToast = useCallback(() => {
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
  }, [toast]);

  const pullSuccessToast = useCallback(() => {
    return toast({
      title: "Request Succeeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          Successfully pulled latest oracle prices.
        </div>
      ),
      variant: "pass",
    });
  }, [toast]);

  const pullFailureToast = useCallback(() => {
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
  }, [toast]);

  const guessPrice = useCallback(() => {
    try {
      const price = BigNumber(10).pow(18).multipliedBy(priceGuess).integerValue();
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
  }, [priceGuess, guessFailureToast, setGuessSuccessHash, writeContract]);

  const pullPrice = useCallback(() => {
    try {
      const proof = bytesProof.toString();
      writeContract({
        address: process.env.NEXT_PUBLIC_ORACLE_GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "pullPairPrices",
        args: [proof],
      }, {
        onSuccess: () => {
          pullSuccessToast();
        }, onError: (error) => {
          console.error(error);
          pullFailureToast();
        }
      });
    } catch (error) {
      console.error(error);
      pullFailureToast();
    }
  }, [bytesProof, pullFailureToast, pullSuccessToast, writeContract]);

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
                <label
                  htmlFor="priceGuess"
                  className="flex md:justify-between w-full gap-1 px-3 py-2.5 mt-2 text-sm text-white whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-neutral-700 max-md:flex-wrap"
                >
                  <div className="my-auto">$</div>
                  <input
                    type="number"
                    id="priceGuess"
                    name="priceGuess"
                    value={priceGuess}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPriceGuess(e.target.value)}
                    className="flex-1 my-auto border-none text-gray-200 bg-transparent h-full outline-none"
                  />
                </label>
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
                <label
                  htmlFor="bytesProof"
                  className="flex md:justify-between w-full gap-1 px-3 py-2.5 mt-2 text-sm text-white whitespace-nowrap rounded-lg border border-solid bg-zinc-800 border-neutral-700 max-md:flex-wrap"
                >
                  <input
                    type="text"
                    id="bytesProof"
                    name="bytesProof"
                    value={bytesProof}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBytesProof(e.target.value)}
                    className="flex-1 my-auto border-none text-gray-200 bg-transparent h-full outline-none"
                  />
                </label>
                <button
                  onClick={pullPrice}
                  disabled={!verified}
                  className="solid-button text-center text-white rounded-md px-10 py-3 w-full"
                  type="button"
                  style={{
                    opacity: !verified ? 0.5 : 1,
                    cursor: !verified ? "not-allowed" : "pointer",
                  }}
                >
                  Pull Price
                </button>
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
