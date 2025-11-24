import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { z } from 'zod'

class TeamsController {
    async createTeams(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().optional()
        })

        const { name, description } = bodySchema.parse(request.body)

        const nameIsAlreadyExist = await prisma.teams.findFirst({
            where: { name }
        })

        if (nameIsAlreadyExist) {
            throw new AppError("Um time já foi criado com esse nome.", 401)
        }

        const teams = await prisma.teams.create({
            data: {
                name, 
                description: description ?? ""
            }
        })

        return response.status(201).json({ teams })
    }
}

export { TeamsController }