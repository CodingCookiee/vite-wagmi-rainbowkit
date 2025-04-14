import { useAccount } from "wagmi";
import { Text, Button } from "../ui/common";
import { WalletConnector } from "../ui/client/WalletConnector";
import { MessageSigner } from "../ui/client/MessageSigner";
import { Link } from "react-router-dom";

function Main() {
  const isConnected = useAccount();

  return (
    <div className="min-h-screen">
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

            <div className="flex flex-col items-center justify-center">
              <Text variant="h3">Go to Contract Interactions</Text>
              <Link to="/contract-interaction">
                <Button variant="link">Contract Interaction</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;
