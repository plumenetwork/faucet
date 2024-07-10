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
};

if (config.isBitgetFaucet) {
  FaucetToken.USDC = FaucetTokenType.USDC;
}

if (config.isGoonFaucet) {
  FaucetToken.GOON = FaucetTokenType.GOON;
}

export { FaucetToken };
