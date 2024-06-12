import { createConnector } from 'wagmi';
import { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { mock } from '@/app/autoWallet/connectors/mock';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const getAutoWallet = () => {
  const privateKey = generatePrivateKey();
  const localAccount = privateKeyToAccount(privateKey);

  return (): Wallet => ({
    id: 'auto',
    name: 'Auto',
    iconBackground: '#fff',
    iconUrl: '',
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      return createConnector((config) => ({
        ...mock({
          accounts: [localAccount.address],
          signMessage: (message) => localAccount.signMessage({ message }),
        })(config),
        ...walletDetails,
      }));
    },
  });
};
