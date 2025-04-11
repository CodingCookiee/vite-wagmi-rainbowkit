import { generateNonce } from "siwe";
import { useSignMessage, useVerifyMessage, useAccount } from "wagmi";


export function SignMessage(address) {

if (address) {
    
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

}
    
}