import { useAccount } from 'wagmi';
import { plumeTestnet } from 'wagmi/chains';

export const useFaucetWallet = () => {
  const { chainId, isConnected, address } = useAccount();
  const isPlumeTestnet = chainId === plumeTestnet.id;

  return {
    isPlumeTestnet,
    isConnected,
    address,
  };
};
