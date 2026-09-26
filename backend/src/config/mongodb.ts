import { connect } from "mongoose";
import { ensureError } from "../shared/errors/ensureError";

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.NODE_ENV === "production" ? process.env.MONGODB_ATLAS_URI : process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        console.log("MongoDB connection string is not defined");
        process.exit(1);
    }
    await connect(MONGODB_URI);
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
    const err = ensureError(error).message;
    console.log("DB connection faild: ", err);
    process.exit(1);
  }
};

export default connectDB;
