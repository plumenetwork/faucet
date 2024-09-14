import { config } from '@/app/config';

export enum FaucetTokenType {
  P = 'P',
  ETH = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  GOON = 'GOON',
  GNUSD = 'gnUSD',
  SGNUSD = 'sgnUSD',
}

type PFaucetToken = {
  P: FaucetTokenType.P;
};

const FaucetToken: PFaucetToken & { [key in FaucetTokenType]?: string } = {
  P: FaucetTokenType.P,
};

/*
if (config.isBitgetFaucet) {
  FaucetToken.GOON = FaucetTokenType.GOON,
  FaucetToken.USDC = FaucetTokenType.USDC;
}
*/

export { FaucetToken };
