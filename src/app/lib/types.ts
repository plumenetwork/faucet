import { config } from '@/app/config';

export enum FaucetTokenType {
  ETH = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  P = 'P',
  GOONUSD = 'goonUSD',
  STRWA = 'stRWA'
}

const FaucetToken: { [key in FaucetTokenType]?: string } = {
  ETH: FaucetTokenType.ETH,
}

if (config.enabledUsdc) {
  FaucetToken.USDC = FaucetTokenType.USDC;
}

export { FaucetToken };