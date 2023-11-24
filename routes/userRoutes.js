import { Router } from "express";
import { createUser,userLogin,getAuthUserDetails } from "../controller/userController.js";
import { fetchUser } from "../middleware/fetchUser.js";


const router = Router();

router.post("/",createUser);
router.post("/login", userLogin);
router.post("/getuserdata",fetchUser,getAuthUserDetails)
export default router;