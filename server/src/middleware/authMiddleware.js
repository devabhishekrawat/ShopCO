import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorHandlerMiddleware.js";
import userModel from "../user/model/user.schema.js";
import { env } from "../config/dotenv.js";

export const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler(401, "Please login to access this resource"));
        }

        const decodedData = jwt.verify(token, env.jwtSecret);
        const user = await userModel.findById(decodedData.id);

        if (!user) {
            return next(new ErrorHandler(401, "User not found. Please login again"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler(401, "Invalid or expired token. Please login again"));
    }
};

export const authByUserRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler(403, `Role: ${req.user ? req.user.role : "unknown"} is not allowed to access this resource`));
        }
        next();
    };
};