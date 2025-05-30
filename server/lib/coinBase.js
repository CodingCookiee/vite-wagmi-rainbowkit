// Constants for Coinbase WebAuthn detection - use a hardcoded value instead of env var
export const COINBASE_WEBAUTHN_HEADER =  import.meta.env.COINBASE_WEBAUTHN_HEADER;

/**
 * Detects if a signature is from Coinbase Wallet's WebAuthn format
 * @param {string} signature - Hex string signature
 * @returns {boolean} True if the signature appears to be from Coinbase WebAuthn
 */
export function isCoinbaseWebAuthnSignature(signature) {
  return signature && signature.startsWith(COINBASE_WEBAUTHN_HEADER);
}



