export class ErrorHandler extends Error {
    constructor(statusCode, errorMsg) {
        super(errorMsg);
        this.statusCode = statusCode;
    }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = field ? `${field} already exists` : "Duplicate field value entered";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired. Please log in again";
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
};
