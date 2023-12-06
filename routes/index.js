import { Router } from "express";
import UserRoute from "./userRoutes.js"
import UploadImage from "./userImageUploadRoute.js"

const router = Router();

//For User Routes
router.use("/api/user", UserRoute);

//For user image upload

router.use("/api/user", UploadImage);

export default router;