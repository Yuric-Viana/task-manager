import { Router } from "express";

import { userRoutes } from "./user-routes";
import { sessionsRoutes } from "./sessions-routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionsRoutes)

export { router };