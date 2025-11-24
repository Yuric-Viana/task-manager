import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

function errorHandlingMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            message: "Validation error",
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });    
}

export { errorHandlingMiddleware };