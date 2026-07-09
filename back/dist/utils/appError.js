export class AppError extends Error {
    statusCode;
    code;
    isOperational;
    timestamp;
    details;
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", isOperational = true, details) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.timestamp = new Date();
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            status: "error",
            code: this.code,
            message: this.message,
            ...(this.details && { details: this.details }),
            timestamp: this.timestamp.toISOString(),
        };
    }
}
export class BadRequestError extends AppError {
    constructor(message = "Bad request", details) {
        super(message, 400, "BAD_REQUEST", true, details);
    }
}
export class NotFoundError extends AppError {
    constructor(resource = "Resource", details) {
        super(`${resource} not found`, 404, "NOT_FOUND", true, details);
    }
}
export class InternalServerError extends AppError {
    constructor(message = "Internal server error", details) {
        super(message, 500, "INTERNAL_ERROR", false, details);
    }
}
//# sourceMappingURL=appError.js.map