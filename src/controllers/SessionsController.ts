import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { compare } from "bcrypt";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class SessionsController {
    async createSession(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { email, password } = bodySchema.parse(request.body);

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Invalid email or password", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = jwt.sign({ role: user.role ?? "member" }, secret, {
            subject: user.id,
            expiresIn
        });

        const { password: _, ...userWithoutPassword } = user;

        return response.json({
            user: userWithoutPassword,
            token,
        });
    }
}

export { SessionsController };