import { createError } from "../lib/createError.js";
import { session } from "../sessionOptions.js";



export async function getSession(req, res, next){
    try{

        if(!session.address){
            console.log('User not authenticated');
            return;
        }

        return res.status(200).json({
            address: session.address,
            chainId: session.chainId,
        })

    }catch(error){
        console.error('Error getting session', error.message);
        next(error)
    }
}