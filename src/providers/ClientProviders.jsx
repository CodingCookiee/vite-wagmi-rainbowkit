import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  base,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  sepolia,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [arbitrum, base, mainnet, optimism, polygon, sepolia], 
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "NFT Nexus",
  projectId: projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export function ClientProviders({children}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
