import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

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
              <div className="flex gap-4">
                <button
                  onClick={openChainModal}
                  className="gradient-button text-center rounded-md px-10 py-3 w-full"
                  type="button"
                >
                  {chain.name}
                </button>
                <button
                  onClick={openAccountModal}
                  className="gradient-button text-center rounded-md px-10 py-3 w-full"
                  type="button"
                >
                  {account.displayName}
                </button>
              </div>
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
