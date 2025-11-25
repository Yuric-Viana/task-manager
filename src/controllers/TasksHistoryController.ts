import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";

class TasksHistoryController {
    async getAllTasksHistory(request: Request, response: Response) {
        const tasksHistory = await prisma.taskHistory.findMany()

        return response.json(tasksHistory)
    }
}

export { TasksHistoryController }