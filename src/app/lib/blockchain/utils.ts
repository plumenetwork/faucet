import { createConfig, getBalance, http } from '@wagmi/core';
import { plumeTestnet } from '../chains';
import { config } from '@/app/config';

export const getAddressBalance = async (address: `0x${string}`) => {
  const wagmiConfig = createConfig({
    chains: [plumeTestnet],
    transports: {
      [plumeTestnet.id]: http(),
    },
  });
  const { decimals, symbol, value } = await getBalance(wagmiConfig, {
    address: config.faucetContractAddress,
  });
  return Number(value) / 10 ** decimals;
};
