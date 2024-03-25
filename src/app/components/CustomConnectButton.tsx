import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useToast } from './ui/use-toast';

export const CustomConnectButton = (props: {
  verified: boolean;
  walletAddress: string | undefined;
}) => {
  const { toast } = useToast();

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

  const successToast = () => {
    return toast({
      title: "Request Succeeded",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          You&apos;ll receive 0.00025 testnet ETH in your wallet within a minute.
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
          Sorry, your request failed. The faucet may be temporarily out of tokens.
        </div>
      ),
      variant: "fail",
    });
  };

  const { verified, walletAddress } = props;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain && walletAddress != null;

        return (
          <div
            className="flex cursor-pointer items-center py-2 mt-4 text-base font-semibold leading-6 rounded-lg text-zinc-800 max-w-full"
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
                Get Tokens
              </button>
            ) : (
              <button
                onClick={openConnectModal}
                className="gradient-button text-center text-white rounded-md px-10 py-3 w-full"
                type="button"
              >
                Connect Bitget Wallet
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
