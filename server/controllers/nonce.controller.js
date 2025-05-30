import { createError } from '../lib/createError.js'
import { getIronSession } from "iron-session";
import { generateNonce } from "siwe";
import { session } from '../sessionOptions.js'


export async function generateMessageNonce(req, res, next){
    try{
        session.nonce = generateNonce();
        await session.save();

        return res.status(200).(session.nonce, {
            success:true,
            headers:{
                'Content-Type': 'text/plain',
            },
        })

    }catch(error){
        console.error('Error generating nonce', error);
        next(createError(400, 'Failed to generate nonce'));
    }
}