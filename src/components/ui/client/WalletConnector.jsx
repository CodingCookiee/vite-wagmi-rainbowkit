
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../common";

export function WalletConnector({ className, showAccountInfo = true }) {



  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            className={className}
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="outline"
                    onClick={() => {
                      try {
                        openConnectModal();
                      } catch (error) {
                        console.error("Error opening connect modal:", error);
                      }
                    }}
                    type="button"
                    className="px-6 py-5 bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <div
                  className={`text-center ${
                    !showAccountInfo ? "flex items-center" : ""
                  }`}
                >
                  {showAccountInfo ? (
                    <>
                      <p className="text-green-600 dark:text-green-400 mb-2">
                        ✓ Wallet Connected
                      </p>
                      <div className="flex flex-col space-y-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            try {
                              openChainModal();
                            } catch (error) {
                              console.error(
                                "Error opening chain modal:",
                                error
                              );
                            }
                          }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <div className="mr-2">
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  className="h-6 w-6"
                                />
                              )}
                            </div>
                          )}
                          {chain.name ?? chain.id}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            try {
                              openAccountModal();
                            } catch (error) {
                              console.error(
                                "Error opening account modal:",
                                error
                              );
                            }
                          }}
                          type="button"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        try {
                          openAccountModal();
                        } catch (error) {
                          console.error("Error opening account modal:", error);
                        }
                      }}
                      type="button"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {account.displayName}
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default WalletConnector;
