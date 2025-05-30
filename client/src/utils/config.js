import { createConfig, http } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "@wagmi/connectors";

const chainId = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111");
const activeChain = chainId === 1 ? mainnet : sepolia;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const config =
  getDefaultConfig({
    appName: "NFT Nexus",
    appIcon: "/app/favicon.png",
    appUrl: import.meta.env.CLIENT_URL || "http://localhost:5174",
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    projectId: projectId,
    chains: [arbitrum, base, mainnet, optimism, polygon, sepolia],
    // connectors: [
    //   coinbaseWallet({
    //     qrcode: true,
    //     appName: "NFT Nexus",
    //     appLogoUrl: "/app/favicon.png",
    //     darkMode: true,
    //   }),
    //     injected(
    //       {
    //       target() {
    //         return {
    //           id: "windowProvider",
    //           name: "Window Provider",
    //           provider: window.ethereum,
    //         };
    //       },
    //     }
    //   ),
    //     metaMask({
    //       headless: true,
    //       logging: { developerMode: true, sdk: true },
    //       showQrModal: true,
    //       dappMetadata: {
    //         name: "NFT Nexus",
    //         description: "NFT Nexus - Your NFT Dashboard & Marketplace",
    //         url: 'http://localhost:5173',
    //         iconUrl: "app/favicon.png",
    //       },
    //     }),
    //   walletConnect({
    //     customStoragePrefix: "wagmi",
    //     projectId: projectId,
    //     showQrModal: false,
    //     metaData: {
    //       name: "NFT Nexus",
    //       description: "NFT Nexus - Your NFT Dashboard & Marketplace",
    //       url: "http://localhost:5173",
    //     },
    //     qrModalOptions: {
    //       themeMode: "dark",
    //     },
    //   }),
    // ],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_ID
        }`
      ),
      [sepolia.id]: http(
        import.meta.env.VITE_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
    },
  });
