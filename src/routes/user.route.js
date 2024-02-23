import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateCoins, userAllDetails, userVerifed } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/userVerified").post(userVerifed)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJwt,logoutUser)
router.route("/userDetails").get(verifyJwt,userAllDetails)
router.route("/updateCoins").patch(verifyJwt,updateCoins)
router.route("/refreshAccessToken").get(refreshAccessToken)


export default router
