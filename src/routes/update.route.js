import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { updateEducational, updateExperience, updatePersonal, updateProject } from "../controllers/update.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/personal").patch(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"resume",
        maxCount:1
    }
]) ,verifyJwt,updatePersonal)
router.route("/educational").patch(verifyJwt,updateEducational)
router.route("/project").patch(verifyJwt,updateProject)
router.route("/experience").patch(verifyJwt,upload.single("coverLetter"),updateExperience)


export default router
