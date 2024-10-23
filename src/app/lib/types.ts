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

const FaucetToken: EthFaucetToken & { [key in FaucetTokenType]?: string } = {
  ETH: FaucetTokenType.ETH,
};

export { FaucetToken };
