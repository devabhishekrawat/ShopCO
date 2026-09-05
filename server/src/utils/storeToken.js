import { env } from "../config/dotenv.js";

export const storeTokenInCookie = async (user, res, statusCode) => {
    const isProduction = env.nodeEnv === "production";
    const token = user.getJWTToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + Number(env.cookieExpireIn || 1) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
    };

    const userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            user: userData,
            token
        });
};