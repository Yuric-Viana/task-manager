import { Router } from "express";

import { TasksController } from "@/controllers/TasksController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { TasksHistoryController } from "@/controllers/TasksHistoryController";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { TaskStatusController } from "@/controllers/TaskStatusController";

const taskRoute = Router()
const tasksController = new TasksController()
const taskStatusController = new TaskStatusController
const tasksHistoryController = new TasksHistoryController()

taskRoute.patch("/update-task/:taskId", ensureAuthenticated, tasksController.updateTask)
taskRoute.patch("/update-status/:taskId", ensureAuthenticated, taskStatusController.createTaskStatus)

taskRoute.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))

taskRoute.post("/create-task", tasksController.createTask)
taskRoute.get("/all-tasks", tasksController.getTasks)
taskRoute.get("/team-tasks/:teamId", tasksController.getAllTasksByTeam)
taskRoute.delete("/delete-task/:taskId", tasksController.deleteTask)

taskRoute.get("/all-tasks-history", tasksHistoryController.getAllTasksHistory)

export { taskRoute }