import { configDotenv } from "dotenv";

configDotenv();


export const env = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, "") : process.env.CLIENT_URL,
    cookieExpireIn: process.env.COOKIE_EXPIRES_IN,
    jwtExpireIn: process.env.JWT_EXPIRE_IN
}