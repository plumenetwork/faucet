import { getAddressBalance } from '@/app/lib/blockchain/utils';
import { config } from '@/app/config';
import { addGaugeMetric } from '@/app/lib/metrics';

export const startFaucetBalanceMonitor = () => {
  const addFaucetBalanceGaugeMetric = (
    faucetBalance: number,
    faucetContractAddress: string
  ) => {
    addGaugeMetric(
      'faucet_balance',
      'This is a custom gauge metric for faucet balance',
      faucetBalance,
      {
        contract_address: faucetContractAddress,
      }
    );
  };

  setInterval(async () => {
    const faucetBalance = await getAddressBalance(config.faucetContractAddress);
    addFaucetBalanceGaugeMetric(faucetBalance, config.faucetContractAddress);
  }, 60 * 1000);
};
