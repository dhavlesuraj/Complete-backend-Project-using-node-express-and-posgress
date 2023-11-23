import { Router } from "express";
import { createUser,userLogin } from "../controller/userController.js";

const router = Router();

router.post("/",createUser);
router.post("/login", userLogin);
export default router;