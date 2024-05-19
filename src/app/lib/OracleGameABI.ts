export const abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'oracle_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'pairs_',
        type: 'uint256[]',
        internalType: 'uint256[]'
      },
      {
        name: 'startTime_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allPairs',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'currentPairIndex',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'int256',
        internalType: 'int256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getUserGuesses',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct OracleGame.UserGuess[]',
        components: [
          {
            name: 'pair',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'timestamp',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'price',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'rewarded',
            type: 'bool',
            internalType: 'bool'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'guessPairPrice',
    inputs: [
      {
        name: 'price',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'guessWaitTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'oracle',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISupraOraclePull'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pairDuration',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'priceGuesses',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'firstGuesser',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'lastGuesser',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'lastTimestamp',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pullPairPrices',
    inputs: [
      {
        name: '_bytesProof',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'startTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'userPoints',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'GuessPairPrice',
    inputs: [
      {
        name: 'guesser',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'pair',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'price',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RewardPairGuess',
    inputs: [
      {
        name: 'guesser',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'pair',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256'
      },
      {
        name: 'guessPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'actualPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'points',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  }
]
