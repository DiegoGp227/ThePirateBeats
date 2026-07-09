import { AppError, InternalServerError } from "./appError.js";
import { logger } from "./logger.js";
export const errorHandler = (error, _req, res, _next) => {
    logger.error("Unhandled error", error);
    if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
    }
    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
};
//# sourceMappingURL=errorHandler.js.map