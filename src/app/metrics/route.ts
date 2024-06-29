import { Gauge, collectDefaultMetrics, register } from 'prom-client';
import { config } from '@/app/config';
import { getAddressBalance } from '@/app/lib/blockchain/utils';

collectDefaultMetrics();

const faucetBalanceGauge = new Gauge({
  name: 'faucet_balance',
  help: 'Current balance of the faucet',
  labelNames: ['contractAddress'],
});

export const GET = async (request: Request) => {
  const faucetBalance = await getAddressBalance(config.faucetContractAddress);

  faucetBalanceGauge
    .labels({ contractAddress: config.faucetContractAddress })
    .set(faucetBalance);

  const metrics = await register.metrics();
  return new Response(metrics, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
    },
  });
};
