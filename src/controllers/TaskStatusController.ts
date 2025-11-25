import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/lib/prisma";
import { z } from "zod"

class TaskStatusController {
    async createTaskStatus(request: Request, response: Response) {
        const paramsSchema = z.object({
            taskId: z.string().uuid()
        })

        const bodySchema = z.object({
            status: z.enum(['pending', 'in_progress', 'completed']),
        })

        const { taskId } = paramsSchema.parse(request.params)

        const { status } = bodySchema.parse(request.body)

        const task = await prisma.tasks.findFirst({
            where: { id: taskId }
        })

        if (!task) {
            throw new AppError("Tarefa inexistente.", 404)
        }

        if (task.assignedTo != request.user.id && request.user.role != "admin") {
            throw new AppError("Não autorizado.", 404)
        }

        const updateTask = await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                status
            }
        })

        const createdHistory = await prisma.taskHistory.create({
            data: {
                taskId,
                changedBy: request.user.id,
                oldStatus: task.status,
                newStatus: status
            }
        })

        return response.status(200).json({ 
            Task: updateTask,
            History: createdHistory
        })

    }
}

export { TaskStatusController }