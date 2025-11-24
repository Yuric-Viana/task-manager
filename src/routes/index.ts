import { Router } from "express";

import { userRoutes } from "./user-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionsRoutes)
router.use("/teams", teamsRoutes)

export { router };