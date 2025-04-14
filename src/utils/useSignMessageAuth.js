import { useState, useCallback } from "react";
import { useSignMessage as useWagmiSignMessage } from "wagmi";
import { generateNonce } from "siwe";

/**
 * Custom hook for handling message signing with authentication context
 * @returns {Object} Signing methods and state
 */
export function useSignMessageAuth() {
  const [authMessage, setAuthMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, signing, signed, error
  const [errorText, setErrorText] = useState("");

  // wagmi's sign message hook
  const {
    signMessage,
    data: signature,
    isPending: isSignPending,
    isError: isSignError,
    error: signError,
    reset: resetSignature,
  } = useWagmiSignMessage();

  // Generate authentication message for a given address
  const generateAuthMessage = useCallback((address) => {
    if (!address) return "";

    const nonce = generateNonce();
    const message = `Sign this message to authenticate with NFT Nexus

Wallet: ${address}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

No gas fees or blockchain transactions will be initiated by this action.`;

    setAuthMessage(message);
    return message;
  }, []);

  // Request signature for the current message
  const requestSignature = useCallback(
    async (message) => {
      setErrorText("");
      setStatus("signing");

      try {
        await signMessage({ message: message || authMessage });
        setStatus("signed");
        return true;
      } catch (error) {
        console.error("Error signing message:", error);
        setErrorText(error.message || "Failed to sign message");
        setStatus("error");
        return false;
      }
    },
    [authMessage, signMessage]
  );

  // Check for existing session
  const checkExistingSession = useCallback((address) => {
    if (!address) return null;

    const storedSession = localStorage.getItem("auth-session");
    if (!storedSession) return null;

    try {
      const session = JSON.parse(storedSession);
      if (
        session.address === address &&
        new Date(session.expiresAt) > new Date()
      ) {
        return session;
      } else {
        localStorage.removeItem("auth-session");
        return null;
      }
    } catch (error) {
      console.error("Error parsing session:", error);
      localStorage.removeItem("auth-session");
      return null;
    }
  }, []);

  // Reset the auth state
  const resetAuth = useCallback(() => {
    setStatus("idle");
    setErrorText("");
    resetSignature();
  }, [resetSignature]);

  // Return the necessary data and functions
  return {
    // State
    authMessage,
    signature,
    status,
    errorText,
    isSignPending,
    isSignError,
    signError,

    // Actions
    generateAuthMessage,
    requestSignature,
    checkExistingSession,
    resetAuth,

    // Internal setters (for advanced use)
    setAuthMessage,
    setStatus,
    setErrorText,
  };
}
