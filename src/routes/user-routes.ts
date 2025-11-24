import { Router } from "express";

import { UsersController } from "@/controllers/UsersController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const userRoutes = Router();
const usersController = new UsersController();

userRoutes.post("/", usersController.createUser);
userRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), usersController.getUsers)

export { userRoutes };