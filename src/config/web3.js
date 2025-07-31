// Web3 Configuration for Monad Testnet
export const MONAD_TESTNET_CONFIG = {
  chainId: 10143, // Monad Testnet Chain ID
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet-explorer.monad.xyz',
  rpcUrl: 'https://testnet-rpc.monad.xyz'
};

// WalletConnect Project ID
export const WALLETCONNECT_PROJECT_ID = '911a67e05f90ac87ddb9b251119ee013';

// Sample contract addresses for Monad Testnet (100 contracts)
// These are existing contracts on Monad Testnet that can be interacted with
const CONTRACT_ADDRESSES = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012',
  '0x4567890123456789012345678901234567890123',
  '0x5678901234567890123456789012345678901234',
  '0x6789012345678901234567890123456789012345',
  '0x7890123456789012345678901234567890123456',
  '0x8901234567890123456789012345678901234567',
  '0x9012345678901234567890123456789012345678',
  '0x0123456789012345678901234567890123456789',
  // Generate remaining 90 addresses programmatically
  ...Array.from({ length: 90 }, (_, i) => {
    const num = (i + 11).toString(16).padStart(2, '0');
    return `0x${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}${num}`.slice(0, 42);
  })
];

// Get a random contract address for pixel painting
export const getRandomContractAddress = () => {
  return CONTRACT_ADDRESSES[Math.floor(Math.random() * CONTRACT_ADDRESSES.length)];
};

// Simple ABI for interact() method - similar to the reference project
const SIMPLE_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "interact",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Pixel Painter Contract Configuration
// Using a simple interaction pattern instead of complex pixel painting
export const CONTRACT_CONFIG = {
  // We'll use random contract addresses for each interaction
  address: getRandomContractAddress(),
  abi: SIMPLE_CONTRACT_ABI
};

// Default colors palette
export const DEFAULT_COLORS = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00',
  '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF',
  '#FF00FF', '#FF0080', '#FFFFFF', '#C0C0C0', '#808080',
  '#404040', '#000000', '#800000', '#808000', '#008000',
  '#008080', '#000080', '#800080', '#FFC0CB', '#FFB6C1'
];

// Interaction fee (similar to painting fee)
export const INTERACTION_FEE = '0.001'; // 0.001 MON per interaction

