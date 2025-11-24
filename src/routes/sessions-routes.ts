import { Router } from "express";

import { SessionsController } from "@/controllers/SessionsController";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.createSession);

export { sessionsRoutes };