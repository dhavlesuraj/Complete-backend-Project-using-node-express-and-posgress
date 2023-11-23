import { Router } from "express";
import UserRoute from "./userRoutes.js"

const router = Router();

//For User Routes
router.use("/api/user", UserRoute);

export default router;