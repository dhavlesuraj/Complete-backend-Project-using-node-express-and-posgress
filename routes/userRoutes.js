import { Router } from "express";
import { createUser,userLogin,getAuthUserDetails, updatePassword, updateUserDetails } from "../controller/userController.js";
import { fetchUser } from "../middleware/fetchUser.js";


const router = Router();

router.post("/",createUser);
router.post("/login", userLogin);
router.post("/getuserdata",fetchUser,getAuthUserDetails)
router.post("/updatepssword",fetchUser,updatePassword);
router.post("/updateuserdetails", fetchUser,updateUserDetails);
export default router;