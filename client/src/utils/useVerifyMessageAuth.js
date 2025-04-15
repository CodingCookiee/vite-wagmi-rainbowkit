import { useState, useCallback, useEffect } from "react";
import { useVerifyMessage as useWagmiVerifyMessage } from "wagmi";

/**
 * Custom hook for handling message verification and session management
 * @returns {Object} Verification methods and state
 */
export function useVerifyMessageAuth() {
  const [verificationStatus, setVerificationStatus] = useState("idle"); // idle, verifying, success, error
  const [verificationError, setVerificationError] = useState("");
  const [verificationParams, setVerificationParams] = useState(null);

  // UseVerifyMessage hook accepts configuration and provides results, but not a direct verify function
  const {
    data: isVerified,
    isSuccess: isVerificationComplete,
    isError: isVerificationError,
    error: wagmiVerificationError,
    isLoading: isVerifying,
    refetch,
  } = useWagmiVerifyMessage({
    ...verificationParams,
    enabled: Boolean(verificationParams),
  });

  // Start verification process by setting parameters
  const verifySignature = useCallback(({ address, message, signature }) => {
    if (!address || !message || !signature) {
      setVerificationError("Missing required verification data");
      setVerificationStatus("error");
      return false;
    }
    
    setVerificationStatus("verifying");
    setVerificationParams({ address, message, signature });
    return true;
  }, []);

  // Effect to handle verification results
  useEffect(() => {
    if (!verificationParams) return;
    
    if (isVerificationComplete) {
      if (isVerified) {
        // Success: create and store session
        const session = {
          address: verificationParams.address,
          signature: verificationParams.signature,
          signedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem("auth-session", JSON.stringify(session));
        setVerificationStatus("success");
      } else {
        setVerificationError("Signature verification failed");
        setVerificationStatus("error");
      }
    } else if (isVerificationError && wagmiVerificationError) {
      console.error("Verification error:", wagmiVerificationError);
      setVerificationError(wagmiVerificationError?.message || "Failed to verify signature");
      setVerificationStatus("error");
    }
  }, [
    isVerified, 
    isVerificationComplete, 
    isVerificationError, 
    wagmiVerificationError, 
    verificationParams
  ]);

  // Clear session and verification state
  const clearSession = useCallback(() => {
    localStorage.removeItem("auth-session");
    
    // Clear Core wallet-specific data
    if (window.localStorage) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes('core') || key.includes('wagmi') || key.includes('rainbow')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    setVerificationStatus("idle");
    setVerificationError("");
    setVerificationParams(null);
  }, []);

  return {
    // State
    verificationStatus,
    verificationError,
    isVerified,
    isVerificationComplete,
    isVerificationError,
    isVerifying,
    
    // Actions
    verifySignature,
    clearSession,
    
    // Internal setters
    setVerificationStatus,
    setVerificationError,
  };
}