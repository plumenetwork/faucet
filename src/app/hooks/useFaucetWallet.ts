import { useAccount } from 'wagmi';
import { plumeDevnet } from '../chains';

export const useFaucetWallet = () => {
  const { chainId, isConnected, address } = useAccount();
  const isPlumeTestnet = chainId === plumeDevnet.id;

  return {
    isPlumeTestnet,
    isConnected,
    address,
  };
};
