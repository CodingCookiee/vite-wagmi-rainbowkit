import { useEffect, useCallback } from "react";
import { CheckCheck } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Button,
  Text,
  Loader,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common";
import { useSignMessageAuth } from "@/utils/useSignMessageAuth";
import { useVerifyMessageAuth } from "@/utils/useVerifyMessageAuth";

export function MessageSigner({ onAuthStateChange }) {
  const { address } = useAccount();

  // Use our custom hooks
  const {
    authMessage,
    signature,
    status: signStatus,
    errorText: signErrorText,
    isSignPending,
    generateAuthMessage,
    requestSignature,
    checkExistingSession,
    resetAuth,
    setStatus: setSignStatus,
  } = useSignMessageAuth();

  const {
    verificationStatus,
    verificationError,
    isVerifying,
    verifySignature,
    clearSession,
  } = useVerifyMessageAuth();

  // Combined status for UI display
  const status =
    verificationStatus === "success"
      ? "success"
      : verificationStatus === "verifying" || isVerifying
      ? "verifying"
      : signStatus;

  const errorText = verificationError || signErrorText;

  // Notify parent component about auth state changes
  useEffect(() => {
    if (onAuthStateChange) {
      onAuthStateChange(status);
    }
  }, [status, onAuthStateChange]);

  // Initialize message and check for existing session when address changes
  useEffect(() => {
    if (address) {
      const existingSession = checkExistingSession(address);

      if (existingSession) {
        setSignStatus("success");
      } else {
        generateAuthMessage(address);
      }
    }
  }, [address, checkExistingSession, generateAuthMessage, setSignStatus]);

  // When signature is obtained, verify it
  useEffect(() => {
    if (signature && authMessage && address && signStatus === "signed") {
      verifySignature({ address, message: authMessage, signature });
    }
  }, [signature, authMessage, address, signStatus, verifySignature]);

  // Handle authentication request
  const handleAuthenticate = useCallback(() => {
    requestSignature();
  }, [requestSignature]);

  // Handle sign out - clean up session and disconnect wallet
  const handleSignOut = useCallback(() => {
    // Clear session data
    clearSession();
    resetAuth();
  }, [clearSession, resetAuth]);

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
                resetAuth();
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
            <Button
              onClick={handleAuthenticate}
              disabled={
                isSignPending ||
                status === "verifying" ||
                !authMessage ||
                status === "signing"
              }
              className="w-full"
            >
              {status === "signing"
                ? "Signing..."
                : status === "verifying"
                ? "Verifying..."
                : "Sign to Authenticate"}
            </Button>

            {(status === "verifying" || status === "signing") && (
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
