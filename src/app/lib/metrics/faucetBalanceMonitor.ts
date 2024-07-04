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

    const faucetEoaContractAddress =
      '0xb28f50F7b12f609ee2868B7e6aecB58E0a7BB936';
    const faucetEoaBalance = await getAddressBalance(faucetEoaContractAddress);
    addFaucetBalanceGaugeMetric(faucetEoaBalance, faucetEoaContractAddress);

    const bitGetFaucetContractAddress =
      '0x59c2706C789791823D3DbF1b32aBA9004662c8a4';
    const bitGetFaucetBalance = await getAddressBalance(
      bitGetFaucetContractAddress
    );
    addFaucetBalanceGaugeMetric(
      bitGetFaucetBalance,
      bitGetFaucetContractAddress
    );

    const bitGetFaucetEoaContractAddress =
      '0x62a8bbB065cdBBde02A87e4Dd6Daaacd570F8ACF';
    const bitGetFaucetEoaBalance = await getAddressBalance(
      bitGetFaucetEoaContractAddress
    );
    addFaucetBalanceGaugeMetric(
      bitGetFaucetEoaBalance,
      bitGetFaucetEoaContractAddress
    );

    const prodAdminContractAddress =
      '0x91D8c1dC4eD9D34300e8351435A598798f958e4F';
    const prodAdminBalance = await getAddressBalance(prodAdminContractAddress);
    addFaucetBalanceGaugeMetric(prodAdminBalance, prodAdminContractAddress);

    const devAdminContractaddress =
      '0xF5A6c4a29610722C84dC25222AF09FA81fAa4BDE';
    const devAdminBalance = await getAddressBalance(devAdminContractaddress);
    addFaucetBalanceGaugeMetric(devAdminBalance, devAdminContractaddress);
  }, 60 * 1000);
};
