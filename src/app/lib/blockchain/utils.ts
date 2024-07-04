import { createConfig, getBalance, http } from '@wagmi/core';
import { plumeTestnet } from '@wagmi/core/chains';

export const getAddressBalance = async (address: `0x${string}`) => {
  const wagmiConfig = createConfig({
    chains: [plumeTestnet],
    transports: {
      [plumeTestnet.id]: http(),
    },
  });
  const { decimals, symbol, value } = await getBalance(wagmiConfig, {
    address,
  });
  return Number(value) / 10 ** decimals;
};
