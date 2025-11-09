import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  arbitrum,
  optimism,
  polygon,
  base,
  bsc,
  avalanche,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SideShift Trader',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [
    mainnet,
    arbitrum,
    optimism,
    polygon,
    base,
    bsc,
    avalanche,
  ],
  ssr: true,
});

