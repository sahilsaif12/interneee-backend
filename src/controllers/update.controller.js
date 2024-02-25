import mongoose from "mongoose";
import { EducationalDetail } from "../models/Educational.model.js";
import { PersonalDetail } from "../models/Personal.model.js";
import { ProjectDetail } from "../models/Project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ExperienceDetail } from "../models/Experience.model.js";
import { User } from "../models/user.model.js";

const updatePersonal=asyncHandler(async(req, res) => {
    // console.log(req.files);
    const{mobile, linkedInLink, githubLink}=req.body
    const avatarLocalPath=req.files.avatar?.length>0? req.files.avatar[0].path : false
    const resumeLocalPath=req.files.resume?.length>0? req.files.resume[0].path : false
    
    if([mobile,linkedInLink, githubLink,avatarLocalPath,resumeLocalPath]?.every((field)=> field=="" || field==false)){
        throw new ApiError(400,"all fields are empty, atleast one needed to perform update")
    }
    
    let updateFields={
        owner:req.user?._id
    }

    if (mobile?.trim()!="") updateFields.mobile = mobile
    if (linkedInLink?.trim()!="") updateFields.linkedInLink = linkedInLink
    if (githubLink?.trim()!="") updateFields.githubLink = githubLink


    if (avatarLocalPath) {
        let avatar=await uploadOnCloudinary(avatarLocalPath)
        updateFields.avatar=avatar.url
    }
    if (resumeLocalPath) {
        let resume=await uploadOnCloudinary(resumeLocalPath)
        updateFields.resume=resume.url
    }
   
    
    const personal=await PersonalDetail.find({owner:updateFields.owner})
    let details

    if (personal.length==0) {
        details=await PersonalDetail.create(updateFields)
    }
    else{
        details=await PersonalDetail.findOneAndUpdate(
            {owner:req.user?._id},
            {
                $set:updateFields
            },
            {new :true}
            )
    }
    
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                personal_details: details._id
            }
        }
    )
    if (!details) {
        // console.log(details);
        throw new ApiError(500, "something server problem while updating in database")
    }

    res.status(200)
    .json(
        new ApiResponse(200,details,"personal details updated successfully")
    )
})


const updateEducational=asyncHandler(async(req, res) => {
    const{ instituteType,instituteName,startDate,endDate}=req.body
 
    if([instituteType,instituteName,startDate,endDate]?.every((field)=> field=="" || field==false)){
        throw new ApiError(400,"all fields are empty, atleast one needed to perform update")
    }
    
    let updateFields={
        owner:req.user?._id
    }

    if (instituteType?.trim()!="") updateFields.instituteType = instituteType
    if (instituteName?.trim()!="") updateFields.instituteName = instituteName
    if (startDate?.trim()!="") updateFields.startDate = startDate
    if (endDate?.trim()!="") updateFields.endDate = endDate


    const educational=await EducationalDetail.find({owner:updateFields.owner})
    let details

    if (educational.length==0) {

        details=await EducationalDetail.create(updateFields)
    }
    else{
        details=await EducationalDetail.findOneAndUpdate(
            {owner:req.user?._id},
            {
                $set:updateFields
            },
            {new :true}
            )
    }
    
    if (!details) {
        // console.log(details);
        throw new ApiError(500, "something server problem while updating in database")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                educational_details: details._id
            }
        }
    )

    res.status(200)
    .json(
        new ApiResponse(200,details,"Educational details updated successfully")
    )
})


const updateExperience =asyncHandler(async(req, res) => {
    const{experienceType,companyName,companyWebsite,role,startDate,endDate,ex_id}=req.body
    const coverLetterLocalPath=req.file?.path

    if([experienceType,companyName,companyWebsite,role,startDate,endDate,coverLetterLocalPath]?.every((field)=> field=="" || field==false)){
        throw new ApiError(400,"all fields are empty, at least one needed to perform update")
    }
    
    let updateFields={
        owner:req.user?._id
    }

    if (experienceType?.trim()!="") updateFields.experienceType = experienceType
    if (companyName?.trim()!="") updateFields.companyName = companyName
    if (companyWebsite?.trim()!="") updateFields.companyWebsite = companyWebsite
    if (role?.trim()!="") updateFields.role = role
    if (startDate?.trim()!="") updateFields.startDate = startDate
    if (endDate?.trim()!="") updateFields.endDate = endDate

    // if (coverLetterLocalPath) {
    //     let coverLetter=await uploadOnCloudinary(coverLetterLocalPath)
    //     updateFields.coverLetter=coverLetter.url
    // }

    const experience=await ExperienceDetail.findOne({
        $and: [
            { _id: new mongoose.Types.ObjectId(ex_id)  },
            { owner: updateFields.owner }
        ]
    })
    
    let details
    if (!experience || experience.length==0) {
        details=await ExperienceDetail.create(updateFields)
        
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push: {
                    experience_details: {
                        $each: [details._id],
                    }
                }
            }
        )
    }
    else{
        details=await ExperienceDetail.findOneAndUpdate(
            {
                $and:[
                    {_id: new mongoose.Types.ObjectId(ex_id)},
                    {owner:req.user?._id}
                ]
            },
            {
                $set:updateFields
            },
            {new :true}
            )
    }
    
    if (!details) {
        // console.log(details);
        throw new ApiError(500, "something server problem while updating in database")
    }

    


    res.status(200)
    .json(
        new ApiResponse(200,details,"experience details updated successfully")
    )
})

const updateProject=asyncHandler(async(req, res) => {
    const{name,desc,projectType,projectLink}=req.body
 
    if([name,desc,projectType,projectLink]?.every((field)=> field=="" || field==false)){
        throw new ApiError(400,"all fields are empty, at least one needed to perform update")
    }
    
    let updateFields={
        owner:req.user?._id
    }

    if (name?.trim()!="") updateFields.name = name
    if (desc?.trim()!="") updateFields.desc = desc
    if (projectType?.trim()!="") updateFields.projectType = projectType
    if (projectLink?.trim()!="") updateFields.projectLink = projectLink


    const project=await ProjectDetail.find({owner:updateFields.owner})
    let details

    if (project.length==0) {
        details=await ProjectDetail.create(updateFields)
    }
    else{
        details=await ProjectDetail.findOneAndUpdate(
            {owner:req.user?._id},
            {
                $set:updateFields
            },
            {new :true}
            )
    }
    
    if (!details) {
        // console.log(details);
        throw new ApiError(500, "something server problem while updating in database")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                project_details: details._id
            }
        }
    )
    res.status(200)
    .json(
        new ApiResponse(200,details,"Project details updated successfully")
    )
})



export{
    updatePersonal,
    updateEducational,
    updateProject,
    updateExperience

}