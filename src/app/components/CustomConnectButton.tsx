import { useState } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnectButton = (props: {
  connectedAddress: string;
  setConnectedAddress: (arg0: string) => void;
}) => {
  const handleClaimTokens = () => {};
  const { connectedAddress, setConnectedAddress } = props;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        setConnectedAddress(connected ? account.address : "");

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
                className="gradient-button text-center rounded-md px-10 py-3 w-full"
                type="button"
              >
                Claim Tokens
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
