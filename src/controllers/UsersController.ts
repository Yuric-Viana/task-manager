import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UsersController {
    async createUser(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password } = bodySchema.parse(request.body);

        const existingUser = await prisma.user.findFirst({
            where: { email }
        })

        if (existingUser) {
            throw new AppError("User with this email already exists", 409);
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword,
            }
        })

        const { password: _, ...userWithoutPassword } = user;

        return response.json(userWithoutPassword);
    }

    async getUsers(request: Request, response: Response) {
        const users = await prisma.user.findMany()

        return response.json(users)
    }
}

export { UsersController };