import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // Mainnets
  mainnet,
  arbitrum,
  optimism,
  polygon,
  base,
  bsc,
  avalanche,
  // Testnets
  sepolia,
  goerli,
  arbitrumSepolia,
  arbitrumGoerli,
  optimismSepolia,
  optimismGoerli,
  polygonAmoy,
  polygonMumbai,
  baseSepolia,
  baseGoerli,
  bscTestnet,
  avalancheFuji,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'FlashTrades',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [
    // Mainnets
    mainnet,
    arbitrum,
    optimism,
    polygon,
    base,
    bsc,
    avalanche,
    // Testnets
    sepolia,
    goerli,
    arbitrumSepolia,
    arbitrumGoerli,
    optimismSepolia,
    optimismGoerli,
    polygonAmoy,
    polygonMumbai,
    baseSepolia,
    baseGoerli,
    bscTestnet,
    avalancheFuji,
  ],
  ssr: true,
});

