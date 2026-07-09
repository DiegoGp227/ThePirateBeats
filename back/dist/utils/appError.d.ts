export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly timestamp: Date;
    readonly details?: any;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean, details?: any);
    toJSON(): any;
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string, details?: any);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string, details?: any);
}
