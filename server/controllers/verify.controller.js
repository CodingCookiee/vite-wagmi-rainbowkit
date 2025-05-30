import { createError } from "../lib/createError.js";
import { session } from "../sessionOptions.js";
import { SiweMessage } from "siwe";
import { isCoinbaseWebAuthnSignature } from "@/app/utils/coinBase";

export async function verifyMessage(req, res, next) {
  try {
    const { message, signature } = await req.json();

    let siweMessage;

    try {
      siweMessage = new SiweMessage(message);
    } catch (error) {
      console.error("Server: Error parsing message", error.message);
      next(createError(400, "Error parsing message"));
    }

    if (isCoinbaseWebAuthSignature(signature)) {
      try {
        if (siweMessage.nonce !== session.nonce) {
          console.error("Server: nonce mismatch for Coinbase Wallet");
          next(createError(400, "Invalid nonce in siweMessage"));
        }

        session.address = address;
        session.chainId = chainId;
        await session.save();

        return res.status(200).json({
          address,
          chainId,
          coinbaseWallet: true,
          message: "Coinbase Wallet authentication successful",
        });
      } catch (error) {
        console.error("Server: Coinbase authentication error", error);
        next(createError(400, "Coinbase Wallet authentication error"));
      }


      try{

        const { data: fields } = await siweMessage.verify({
            signature,
            domain: req.headers.origin,
            nonce: session.nonce,
        });

        session.address = address;
        session.chainId = chainId;
        await session.save();

        return res.status(200).json({
            address,
            chainId,
            message: 'Wallet authentication successfull'
        })



      }catch(error){
        console.error('Server: Error verifying message', error.message);
        next(createError(400, 'Error verifying message'));
      }
    }
  } catch (error) {
    console.error("Server: Siwe Verification error", error.message);
    next(createError(400, "Siwe Verification error"));
  }
}
