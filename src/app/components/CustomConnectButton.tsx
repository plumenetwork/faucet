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
    });
    toast({
      title: "Request Submitted",
      description: (
        <div className="flex flex-row text-[#D2D6DB] text-sm">
          You’ll receive the testnet tokens in your wallet in about 1 minute.
        </div>
      ),
      variant: "pass",
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
                className="solid-button text-center rounded-md px-10 py-3 w-full"
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
                className="gradient-button text-center rounded-md px-10 py-3 w-full"
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
