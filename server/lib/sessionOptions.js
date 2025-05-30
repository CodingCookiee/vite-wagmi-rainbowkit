/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { getIronSession  } from 'iron-session';




const sessionOptions = {
  cookieName: "rainbowkit-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  },
};

export const session = async(req) {
  
const cookieStore = await req.cookies();
const session = await getIronSession(cookieStore, sessionOptions);

return session;
  
}




