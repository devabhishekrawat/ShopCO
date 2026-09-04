export class ErrorHandler extends Error {
    constructor(statusCode, errorMsg) {
        super(errorMsg);
        this.statusCode = statusCode;
    }
}


export const errorHandlerMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({ success: false, error: err.message });

}

