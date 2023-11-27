import { Router } from "express";
import { createUser,userLogin,getAuthUserDetails, updatePassword } from "../controller/userController.js";
import { fetchUser } from "../middleware/fetchUser.js";


const router = Router();

router.post("/",createUser);
router.post("/login", userLogin);
router.post("/getuserdata",fetchUser,getAuthUserDetails)
router.post("/updatepssword",fetchUser,updatePassword);
export default router;