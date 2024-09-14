import { useAccount } from 'wagmi';
import { plumeTestnet } from '../lib/chains';

export const useFaucetWallet = () => {
  const { chainId, isConnected, address } = useAccount();
  const isPlumeTestnet = chainId === plumeTestnet.id;

  return {
    isPlumeTestnet,
    isConnected,
    address,
  };
};
