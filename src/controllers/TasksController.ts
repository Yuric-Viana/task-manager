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

    async updateTask(request: Request, response: Response) {
        const paramsSchema = z.object({
            taskId: z.string().uuid()
        })

        const bodySchema = z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            status: z.enum(['pending', 'in_progress', 'completed']).optional(),
            priority: z.enum(['high', 'medium', 'low']).optional(),
            teamId: z.string().uuid().optional()
        })

        const { taskId } = paramsSchema.parse(request.params)

        const { description, priority, status, teamId, title } = bodySchema.parse(request.body)

        if (description == null && priority == null && status == null && teamId === null && title === null) {
            return response.json({ message: "Nenhum campo foi atualizado." })
        }

        const task = await prisma.tasks.findFirst({
            where: { id: taskId, teamId }
        })

        const team = await prisma.teams.findFirst({
            where: { id: teamId }
        })

        if (!team) {
            throw new AppError("Time inexistente.", 404)
        }

        if (!task) {
            throw new AppError("Tarefa inexistente.", 404)
        }

        if (task.assignedTo != request.user.id && request.user.role != "admin") {
            throw new AppError("Não autorizado.", 403)
        }

        const newTask = await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                title: title ?? task.title,
                description: description ?? task.description,
                status: status ?? task.status,
                priority: priority ?? task.priority,
                teamId: teamId ?? task.teamId
            }
        })

        return response.status(201).json({ newTask })

    }

    async getTasks(request: Request, response: Response) {
        const tasks = await prisma.tasks.findMany()

        return response.json(tasks)
    }

    async getAllTasksByTeam(request: Request, response: Response) {
        const paramsSchema = z.object({
            teamId: z.string().uuid()
        })

        const { teamId } = paramsSchema.parse(request.params)

        const team = await prisma.teams.findFirst({
            where: { id: teamId }
        })

        if (!team) {
            throw new AppError("Time inexistente.", 404)
        }

        const allTasks = await prisma.tasks.findMany({
            where: {
                teamId
            }
        })

        return response.json(allTasks)
    }

    async deleteTask(request: Request, response: Response) {
        const paramsSchema = z.object({
            taskId: z.string().uuid()
        })

        const { taskId } = paramsSchema.parse(request.params)

        const task = await prisma.tasks.findFirst({
            where: { id: taskId }
        })

        if (!task) {
            throw new AppError("Tarefa inexistente.", 404)
        }

        await prisma.tasks.delete({
            where: { id: taskId }
        })

        return response.json({ message: "Tarefa deletada com sucesso." })
    }
}

export { TasksController }