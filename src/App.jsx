import { useAccount } from "wagmi";
import { Text, Button } from "./components/ui/common";
import { WalletConnector } from "./components/ui/client/WalletConnector";
import { MessageSigner } from "./components/ui/client/MessageSigner";

function App() {
  const isConnected = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/favicon.png"
            alt="NFT Nexus Logo"
            className="h-10 w-10 mr-2"
          />
          <Text
            variant="h2"
            weight="semibold"
            className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            NFT Nexus
          </Text>
        </div>
        {/* Header wallet display - compact version */}
        {/* <div className="hidden sm:block">
          <WalletConnector showAccountInfo={false} />
        </div> */}
      </header>

      <main className="container mx-auto p-4 mt-10">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <Text variant="h3" className="text-2xl font-bold mb-4">
            Welcome to NFT Nexus
          </Text>
          <Text
            variant="body"
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            {isConnected
              ? "Authenticate your wallet to access exclusive features"
              : "Connect your wallet to get started exploring your NFT portfolio and the marketplace."}
          </Text>
          <div className="w-full flex flex-col items-center justify-center gap-6">
            {/* Main wallet connect/display area */}
            <div className="w-full flex items-center justify-center">
              <WalletConnector />
            </div>

            {/* Message signer component */}
            <div className="w-full">
              <MessageSigner />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
