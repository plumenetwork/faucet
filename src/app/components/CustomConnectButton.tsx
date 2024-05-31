import { useWriteContract } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { FaucetToken } from "@/app/lib/types";
import { abi } from '../lib/MintABI';
import { useToast } from './ui/use-toast';

export const CustomConnectButton = (props: {
  mint: boolean;
  verified: boolean;
  walletAddress: string | undefined;
  token: FaucetToken | undefined;
  setMintSuccessHash?: (hash: string) => void;
}) => {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();
  const { mint, verified, walletAddress, token = FaucetToken.ETH, setMintSuccessHash } = props;

  const handleClaimTokens = () => {
    fetch("api/faucet", {
      method: "POST",
      headers: { ["Content-Type"]: "application/json" },
      body: JSON.stringify({ walletAddress, token }),
    }).then((res) => {
      if (res.status === 200) {
        successToast();
      } else if (res.status === 429) {
        rateLimitToast();
        successToast();
      } else {
        failureToast();
      }
    });
  };

  const mintNft = () => {
    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_MINT_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "mint",
      });
      setMintSuccessHash && setMintSuccessHash(String(hash));
    } catch (error) {
      console.error(error);
      mintFailureToast();
    }
  };

  const successToast = () => {
    return toast({
      title: "Request Succeeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          You&apos;ll receive
          {token === FaucetToken.ETH ? ' 0.01 ' : ' 100,000 ' }
          testnet {token} in your wallet within a minute.
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
          Sorry, you can only claim tokens once a day.
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

  const mintFailureToast = () => {
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
                {mint && (
                  <button
                    onClick={mintNft}
                    disabled={!verified}
                    className="solid-button text-center text-white rounded-md px-10 py-3 w-full"
                    type="button"
                    style={{
                      opacity: !verified ? 0.5 : 1,
                      cursor: !verified ? "not-allowed" : "pointer",
                    }}
                  >
                    Mint NFT
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={openConnectModal}
                className="gradient-button text-center rounded-md px-10 py-3 w-full text-white"
                type="button"
              >
                Connect Fox Wallet
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
