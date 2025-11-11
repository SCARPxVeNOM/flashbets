// Testnet chain IDs
const TESTNET_CHAIN_IDS = new Set([
  11155111, // Sepolia
  5, // Goerli
  421614, // Arbitrum Sepolia
  421613, // Arbitrum Goerli
  11155420, // Optimism Sepolia
  420, // Optimism Goerli
  80002, // Polygon Amoy
  80001, // Polygon Mumbai
  84532, // Base Sepolia
  84531, // Base Goerli
  97, // BSC Testnet
  43113, // Avalanche Fuji
]);

// Testnet chain names (for network string matching)
const TESTNET_NETWORK_NAMES = new Set([
  'sepolia',
  'goerli',
  'arbitrum-sepolia',
  'arbitrum-goerli',
  'optimism-sepolia',
  'optimism-goerli',
  'polygon-amoy',
  'polygon-mumbai',
  'base-sepolia',
  'base-goerli',
  'bsc-testnet',
  'avalanche-fuji',
  'fuji',
  'mumbai',
  'amoy',
]);

export function isTestnetChain(chainId: number): boolean {
  return TESTNET_CHAIN_IDS.has(chainId);
}

export function isTestnetNetwork(networkName: string): boolean {
  if (!networkName) return false;
  const normalized = networkName.toLowerCase().replace(/\s+/g, '-');
  return TESTNET_NETWORK_NAMES.has(normalized);
}

export function getChainType(chainId: number): 'mainnet' | 'testnet' {
  return isTestnetChain(chainId) ? 'testnet' : 'mainnet';
}

export function getNetworkType(networkName: string): 'mainnet' | 'testnet' {
  return isTestnetNetwork(networkName) ? 'testnet' : 'mainnet';
}

