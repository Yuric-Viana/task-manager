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

    async addMemberToTeam(request: Request, response: Response) {
        const bodySchema = z.object({
            userId: z.string().uuid(),
            teamId: z.string().uuid()
        })

        const { userId: user_id, teamId: team_id } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: { id: user_id }
        })

        if (!user) {
            throw new AppError("Usuário não existente.", 401)
        }

        const team = await prisma.teams.findFirst({
            where: { id: team_id }
        })

        if (!team) {
            throw new AppError("Time não existente.", 401)
        }

        const memberIsAlreadyToTeam = await prisma.teamMembers.findFirst({
            where: { userId: user.id }
        })

        if (memberIsAlreadyToTeam) {
            throw new AppError("O membro já faz parte deste time.", 401)
        }

        const insertMemberToTeam = await prisma.teamMembers.create({
            data: {
                teamId: team_id,
                userId: user_id
            },
            include: {
                users: {
                    select: {
                        name: true
                    }
                },
                teams: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return response.status(201).json(insertMemberToTeam)
    }
}

export { TeamsController }