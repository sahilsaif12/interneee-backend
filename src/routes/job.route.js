import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { allJobs, appliedJobs, jobApply } from "../controllers/job.controller.js";

const router=Router()

router.route("/allJobs").get(verifyJwt,allJobs)
router.route("/applyJob").patch(verifyJwt,jobApply)
router.route("/appliedJobs").get(verifyJwt,appliedJobs)


export default router
