import { connect } from "mongoose";
import { ensureError } from "../helpers/ensureError.js";


const  connectDB = async () => {
    try {
        const MONGODBURI = process.env.MONGODB_URI as string 
        console.log(MONGODBURI)
         await connect(MONGODBURI)
         console.log("Mongodb connected");
    } catch (error) {
        const err = ensureError(error).message
        console.log("DB connection faild: ",err);
        process.exit(1)   
    }   
}


export default connectDB;