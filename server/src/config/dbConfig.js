import mongoose from "mongoose";
import { env } from "./dotenv.js";

let url = env.mongoUri;

export async function ConnectToDB() {
    try {
        await mongoose.connect(url);
        console.log("Mongoose Connected Successfully");
    } catch (err) {
        console.log(err)
        throw err;
    }
}