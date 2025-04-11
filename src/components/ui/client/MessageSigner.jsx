import { useState, useCallback, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { useSignMessage, useVerifyMessage, useAccount } from "wagmi";
import {
  Input,
  Button,
  Text,
  Loader,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common";
import { generateNonce } from "siwe";

export function MessageSigner() {
  const { address } = useAccount();
  const [authMessage, setAuthMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState("idle"); // idle, signing, verifying, success, error
  const [errorText, setErrorText] = useState("");

  // Create a simple authentication message when the component mounts or address changes
  useEffect(() => {
    if (address) {
      // Check for existing session
      const storedSession = localStorage.getItem("auth-session");
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (
            session.address === address &&
            new Date(session.expiresAt) > new Date()
          ) {
            // console.log("Found valid session");
            setStatus("success");
            return;
          } else {
            localStorage.removeItem("auth-session");
          }
        } catch (error) {
          console.error("Error parsing session:", error);
          localStorage.removeItem("auth-session");
        }
      }

      // Generate new auth message
      const nonce = generateNonce();
      const message = `Sign this message to authenticate with NFT Nexus\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nNo gas fees or blockchain transactions will be initiated by this action.`;

      setAuthMessage(message);
      // console.log("Created authentication message:", message);
    }
  }, [address]);

  // Hook for signing messages
  const {
    signMessage,
    data: signatureData,
    isPending: isSignPending,
    isError: isSignError,
    error: signError,
  } = useSignMessage();

  // Effect to handle signature result
  useEffect(() => {
    if (signatureData && authMessage) {
      // console.log(" Signature received:", signatureData);
      setSignature(signatureData);
      setStatus("verifying");
    }
  }, [signatureData, authMessage]);

  // Hook for verifying messages
  const {
    data: isVerified,
    isSuccess: isVerificationComplete,
    isError: isVerificationError,
    error: verificationError,
    refetch: refetchVerification,
  } = useVerifyMessage({
    address,
    message: authMessage,
    signature,
    enabled: Boolean(address && authMessage && signature),
  });

  // Effect to handle verification result
  useEffect(() => {
    if (!address || !authMessage || !signature) return;

    if (isVerificationComplete) {
      // console.log("Verification completed:", isVerified);
      if (isVerified) {
        // Success path - store session and update UI
        const session = {
          address,
          signature,
          signedAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
        localStorage.setItem("auth-session", JSON.stringify(session));
        setStatus("success");
      } else {
        // Failed verification
        setErrorText("Signature verification failed. Please try again.");
        setStatus("error");
      }
    } else if (isVerificationError && verificationError) {
      console.error("Verification error:", verificationError);
      setErrorText(`Verification error: ${verificationError.message}`);
      setStatus("error");
    }
  }, [
    isVerified,
    isVerificationComplete,
    isVerificationError,
    verificationError,
    address,
    authMessage,
    signature,
  ]);

  // Effect to handle signing errors
  useEffect(() => {
    if (isSignError && signError) {
      console.error("Signing error:", signError);
      setErrorText(`Signing error: ${signError.message}`);
      setStatus("error");
    }
  }, [isSignError, signError]);

  // Handle authentication request
  const handleAuthenticate = useCallback(() => {
    setErrorText("");
    setStatus("signing");

    try {
      // console.log("Requesting signature for message:", authMessage);
      signMessage({ message: authMessage });
    } catch (error) {
      console.error("Error initiating signing:", error);
      setErrorText(`Error: ${error.message}`);
      setStatus("error");
    }
  }, [authMessage, signMessage]);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    localStorage.removeItem("auth-session");

    // Clear RainbowKit cache specifically
    //  localStorage.removeItem("rk-recent");
    setStatus("idle");
    setSignature("");
    setErrorText("");
  }, []);

  // If no wallet is connected
  if (!address) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Wallet Authentication</CardTitle>
          <CardDescription>Please connect your wallet first</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Web3 Authentication</CardTitle>
        <CardDescription>
          Authenticate using your wallet signature
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error message display */}
        {errorText && (
          <div className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 p-3 rounded-md text-sm mb-4">
            {errorText}
            <Button
              variant="link"
              size="sm"
              className="ml-2 text-red-600 dark:text-red-300"
              onClick={() => {
                setErrorText("");
                setStatus("idle");
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Main content */}
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-full h-full flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 px-10 py-10 rounded-md mb-4">
              <CheckCheck className="text-green-700" />
              <Text variant="body" className="font-medium">
                Authentication Successful
              </Text>
              <Text variant="small" className="mt-1">
                Your wallet has been verified
              </Text>
            </div>

            <Text
              variant="body"
              className="text-gray-600 dark:text-gray-300 mb-4"
            >
              Authenticated as: {address.substring(0, 6)}...
              {address.substring(address.length - 4)}
            </Text>

            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="mt-4"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            {/* <div>
              <Text variant="body" className="font-medium mb-2">
                Authentication Message:
              </Text>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm font-mono overflow-auto max-h-40">
                {authMessage.split("\n").map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line || " "}
                  </div>
                ))}
              </div>
            </div> */}

            <Button
              onClick={handleAuthenticate}
              disabled={isSignPending || status === "verifying" || !authMessage}
              className="w-full"
            >
              {status === "signing"
                ? "Signing..."
                : status === "verifying"
                ? "Verifying..."
                : "Sign to Authenticate"}
            </Button>

            {status === "verifying" && (
              <div className="flex justify-center mt-2">
                <Loader height="5" width="5" />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MessageSigner;
