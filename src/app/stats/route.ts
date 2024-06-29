import { config } from '@/app/config';
import { getAddressBalance } from '@/app/lib/blockchain/utils';

export const GET = async (request: Request) => {
  const faucetBalance = await getAddressBalance(config.faucetContractAddress);

  const stats = {
    faucetContract: {
      address: config.faucetContractAddress,
      balance: faucetBalance,
    },
  };

  return Response.json(stats);
};