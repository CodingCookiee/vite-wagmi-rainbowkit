import { createError } from '../lib/createError.js';
import { session } from '../lib/sessionOptions.js';


export async function logoutUser(req, res, next){
    try{

        await session.destroy();

        return res.status(200).json({
            success: true,
            message: 'Successfully logged out user'
        })

    }catch(error){
        console.erorr('Error logging out', error.message);
        next(error)
    }
}