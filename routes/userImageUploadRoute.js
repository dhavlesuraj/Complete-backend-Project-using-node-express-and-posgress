import { Router } from "express";
import { uploadImage } from "../controller/userImageUploadController.js";
import { fetchUser } from "../middleware/fetchUser.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/upload",fetchUser, uploadImage);

export default router;
