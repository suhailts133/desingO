import dotenv from "dotenv";
dotenv.config();
import {OAuth2Client} from "google-auth-library"



const secret = process.env.GOOGLE_CLIENT_SECRET as string
const client = process.env.GOOGLE_CLIENT_ID as string


export const oAuth2Client = new OAuth2Client(
        client, 
        secret,
        'postmessage'
)

