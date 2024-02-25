import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/Job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const allJobs=asyncHandler(async(req, res)=>{
    const {page=1 , limit=10}=req.query
    // console.log(page);
    // const jobCollection = mongoose.connection.db.collection("jobs");
    const jobs = await Job.find().skip((page-1)*limit).limit(limit)
    // console.log(jobs);

    res.status(200)
    .json(
        new ApiResponse(200,jobs,"jobs fetched successfully")
    )
})

const jobApply=asyncHandler(async(req, res)=>{
    const {jobId}=req.params
    // console.log(jobId);
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push:{
                applied_jobs:{
                    $each:[jobId]
                }
            }
        }
    )

    res.status(200)
    .json(
        new ApiResponse(200,{_id:jobId},"jobs applied successfully")
    )
    
})

const appliedJobs=asyncHandler(async(req, res)=>{

    const jobs=await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(req.user?._id)}
        },
        // {
        //     $lookup:{
        //         from:"jobs",
        //         localField:"applied_jobs",
        //         foreignField:"_id",
        //         as:"applied_jobs",
        //         pipeline:[
        //             {
        //                 $project:{
        //                     id:0
        //                 }
        //             }
        //         ]
        //     }
        // },
        {
            $lookup:{
                from:"jobs",
                foreignField:"_id",
                localField:"applied_jobs",
                as:"applied_jobs",
                pipeline:[
                    {
                        $project:{
                            id:0
                        }
                    }
                ]
            }
        },
        {
            $project:{
                applied_jobs:1,
                coins:1
            }
        }
    ])

    res.status(200)
    .json(
        new ApiResponse(200,jobs[0],"applied jobs fetched successfully")
    )
})


export {
    allJobs,
    jobApply,
    appliedJobs
}