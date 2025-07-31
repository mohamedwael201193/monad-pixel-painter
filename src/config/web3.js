// Web3 Configuration for Monad Testnet
export const MONAD_TESTNET_CONFIG = {
  chainId: 41454, // Monad Testnet Chain ID
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet-explorer.monad.xyz',
  rpcUrl: 'https://testnet-rpc.monad.xyz'
};

// WalletConnect Project ID
export const WALLETCONNECT_PROJECT_ID = '911a67e05f90ac87ddb9b251119ee013';

// Contract Configuration
export const CONTRACT_CONFIG = {
  // This will be updated after contract deployment
  address: '0x0000000000000000000000000000000000000000',
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "color",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "painter",
          "type": "address"
        }
      ],
      "name": "PixelPainted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "CANVAS_HEIGHT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "CANVAS_WIDTH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "canvas",
      "outputs": [
        {
          "internalType": "string",
          "name": "color",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "painter",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        }
      ],
      "name": "getPixel",
      "outputs": [
        {
          "internalType": "string",
          "name": "color",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "painter",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[][]",
          "name": "coordinates",
          "type": "uint256[][]"
        }
      ],
      "name": "getPixelsBatch",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "colors",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "painters",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "color",
          "type": "string"
        }
      ],
      "name": "paintPixel",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paintingFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        }
      ],
      "name": "setPaintingFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

// Default colors palette
export const DEFAULT_COLORS = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00',
  '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF',
  '#FF00FF', '#FF0080', '#FFFFFF', '#C0C0C0', '#808080',
  '#404040', '#000000', '#800000', '#808000', '#008000',
  '#008080', '#000080', '#800080', '#FFC0CB', '#FFB6C1'
];

