import { Router } from "express";

import { userRoutes } from "./user-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { taskRoute } from "./tasks-routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionsRoutes)
router.use("/teams", teamsRoutes)
router.use("/tasks", taskRoute)

export { router };