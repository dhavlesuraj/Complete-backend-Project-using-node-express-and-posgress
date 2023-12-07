import { Router } from "express";
import { uploadImage,getFileOrImages } from "../controller/userImageUploadController.js";
import { fetchUser } from "../middleware/fetchUser.js";
//import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/upload",fetchUser, uploadImage);
router.get("/getimageorfile",fetchUser,getFileOrImages);

export default router;
