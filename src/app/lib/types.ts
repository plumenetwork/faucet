import { config } from '@/app/config';

export enum FaucetTokenType {
  ETH = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  GOON = 'GOON',
  GOONUSD = 'goonUSD',
  STRWA = 'stRWA',
}

type EthFaucetToken = {
  ETH: FaucetTokenType.ETH;
};

const FaucetToken: EthFaucetToken & { [key in FaucetTokenType]?: string } = {
  ETH: FaucetTokenType.ETH,
  GOON: FaucetTokenType.GOON,
};

if (config.isBitgetFaucet) {
  FaucetToken.USDC = FaucetTokenType.USDC;
}

export { FaucetToken };
