const sourceId = 11_155_111; // sepolia

export const plumeTestnet = /*#__PURE__*/ {
  formatters: undefined,
  fees: undefined,
  serializers: undefined,
  id: 18230,
  name: 'Plume Devnet',
  nativeCurrency: {
    name: 'Sepolia Plume',
    symbol: 'P',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://devnet-rpc.plumenetwork.xyz'],
      webSocket: ['wss://devnet-rpc.plumenetwork.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://devnet-explorer.plumenetwork.xyz',
      apiUrl: 'https://devnet-explorer.plumenetwork.xyz/api',
    },
  },
  testnet: true,
  sourceId,
};
