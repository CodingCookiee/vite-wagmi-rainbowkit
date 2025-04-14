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

// Create a new query client instance
const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  // Check for project ID
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

  // Create configuration after validating project ID
  const config = getDefaultConfig({
    appName: "NFT Nexus",
    projectId: projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_ID || ""
        }`
      ),
      [sepolia.id]: http(
        import.meta.env.VITE_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider

        // coolMode
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
