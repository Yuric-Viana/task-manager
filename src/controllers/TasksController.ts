import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/lib/prisma";
import { z } from 'zod'

class TasksController {
    async createTask(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string(),
            description: z.string().optional(),
            status: z.enum(['pending', 'in_progress', 'completed']).optional(),
            priority: z.enum(['high', 'medium', 'low']).optional(),
            assignedTo: z.string().uuid(),
            teamId: z.string().uuid()
        })

        const { title, description, assignedTo, teamId, priority, status } = bodySchema.parse(request.body)

        const task = await prisma.tasks.create({
            data: {
                title, 
                description: description ?? "",
                assignedTo,
                teamId,
                priority: priority ?? "low",
                status: status ?? "pending"
            }
        })

        return response.status(201).json(task)
    }
}

export { TasksController }