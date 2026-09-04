import jwt, { decode } from "jsonwebtoken";
import { ErrorHandler } from "./errorHandlerMiddleware.js";
import userModel from "../user/model/user.schema.js";
import { env } from "../config/dotenv.js";


export const auth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler(401, "LogIn to Access the Route!!"));
    }

    const decodeToken = jwt.verify(token, env.jwtSecret);
    req.user = await userModel.findById(decodeToken.id);
    console.log(req.user);
    next();
}


// for admin resouce check function
export const authByUserRole = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(403, `Role: ${req.user.role} is not allowed to access this resource`));
        }
        next();
    }
}