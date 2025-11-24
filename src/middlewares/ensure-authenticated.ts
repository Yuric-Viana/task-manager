import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    sub: string,
    role: string
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError("Token JWT não encontrado.")
        }

        const [, token] = authHeader.split(" ")

        const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = {
            id: user_id,
            role
        }

        return next()

    } catch (error) {
        throw new AppError("Token JWT inválido.")
    }

}
