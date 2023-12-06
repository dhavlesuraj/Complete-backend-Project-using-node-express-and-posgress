import { Router } from "express";
import { uploadImage } from "../controller/userImageUploadController.js";
import { fetchUser } from "../middleware/fetchUser.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/upload",fetchUser, upload.single("file"), uploadImage);

export default router;
