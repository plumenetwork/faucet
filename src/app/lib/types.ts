export enum FaucetTokenType {
  ETH = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  GOON = 'GOON',
}

type EthFaucetToken = {
  ETH: FaucetTokenType.ETH;
};

type UsdtFaucetToken = {
  USDT: FaucetTokenType.USDT;
};

const FaucetToken: EthFaucetToken &
  UsdtFaucetToken & { [key in FaucetTokenType]?: string } = {
  ETH: FaucetTokenType.ETH,
  USDT: FaucetTokenType.USDT,
};

export { FaucetToken };
