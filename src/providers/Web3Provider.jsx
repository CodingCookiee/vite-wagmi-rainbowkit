import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

// Use environment variables for sensitive data
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Select chain based on environment
const chainId = parseInt(import.meta.env.VITE_CHAIN_ID || "1");
const availableChains = [mainnet, polygon, optimism, arbitrum, base, sepolia];

export const config = getDefaultConfig({
  appName: "RainbowKit NFT Nexus",
  projectId: projectId,
  chains: availableChains,
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_ID}`
    ),
    [sepolia.id]: http(
      import.meta.env.VITE_RPC_URL || "https://eth-sepolia.public.blastapi.io"
    ),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: false, // Since we're using Vite, not Next.js
});

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
