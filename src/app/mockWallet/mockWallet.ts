import { createConnector } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit';

export const getMockWallet = (account?: `0x${string}`) => {
  const defaultAccount = '0x7C656ef9E2a18fbcDc9524D04A250399A4c07B3d';

  return (): Wallet => ({
    id: 'mock',
    name: 'Mock',
    iconBackground: '#fff',
    iconUrl: '',
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      return createConnector((config) => ({
        ...mock({
          accounts: [account ?? defaultAccount],
        })(config),
        ...walletDetails,
      }));
    },
  });
};
