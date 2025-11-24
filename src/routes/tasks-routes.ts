import { Router } from "express";

import { TasksController } from "@/controllers/TasksController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const taskRoute = Router()
const tasksController = new TasksController()

taskRoute.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
taskRoute.post("/create-task", tasksController.createTask)

export { taskRoute }