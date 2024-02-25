import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs'
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/SendMail.js";

const generateAccessAndRefreshToken = async (userId) => {

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "wrong user id/ user not found")
    }
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

}

const options = {
    httpOnly: false,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName } = req.body

    if ([email, fullName].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Few fields are empty. All fields are required ! ")
    }

    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new ApiError(401, "An user already exists with this email")
    }
    const user = await User.create({
        email,
        fullName
    })

    const createdUser = await User.findById(user._id)

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    let otp = await sendMail(email)

    res.status(200)
        .json(
            new ApiResponse(200, { createdUser, otp }, "user registered successfully")
        )
})

const userVerifed = asyncHandler(async (req, res) => {
    const { id } = req.body
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(id)
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ accessToken, refreshToken })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!(email)) {
        throw new ApiError(400, "email is required ")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not found with this email id ")

    }

    let otp = await sendMail(email)

    res.status(200)
        .json(
            new ApiResponse(200, { user, otp }, "user logged in successfully")
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: ''
            }
        },
        { new: true }
    )

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "user logged out successfully")
        )

})


const updateCoins = asyncHandler(async (req, res) => {
    const { newCoins, op } = req.body
    let coins
    if(op=="dec"){
        coins = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $inc: { coins: -newCoins }
            },
            { new: true }
        )
    }else{
        coins = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $inc: { coins: newCoins }
            },
            { new: true }
        )
    }

    res.status(200)
        .json(
            new ApiResponse(200, { CurrentCoins: coins.coins }, "coins updated successfully")
        )
})

const userAllDetails = asyncHandler(async (req, res) => {

    // console.log(req.user?._id);
    // const allDetails=await User.aggregate([
    //     {
    //         $match:{
    //             _id:req.user?._id
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"personaldetails",
    //             foreignField:"_id",
    //             localField:"personal_details",
    //             as:"personal_details",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         owner:0
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $unwind:"$personal_details"
    //     },
    //     {
    //         $lookup:{
    //             from:"educationaldetails",
    //             foreignField:"_id",
    //             localField:"educational_details",
    //             as:"educational_details",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         owner:0
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $unwind:"$educational_details"
    //     },
    //     {
    //         $lookup:{
    //             from:"projectdetails",
    //             foreignField:"_id",
    //             localField:"project_details",
    //             as:"project_details",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         owner:0
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $unwind:"$project_details"
    //     },
    //     {
    //         $lookup:{
    //             from:"experiencedetails",
    //             foreignField:"_id",
    //             localField:"experience_details",
    //             as:"experience_details",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         owner:0
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $project:{
    //             refreshToken:0
    //         }
    //     }

    // ])
    
    const allDetails = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "personaldetails",
                let: { personal_details: "$personal_details" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$personal_details"]
                            }
                        }
                    },
                ],
                as: "personal_details"
            }
        },
        {
            $unwind: {
                path: "$personal_details",
                preserveNullAndEmptyArrays: true // Preserve empty arrays
            }
        },
        {
            $lookup: {
                from: "educationaldetails",
                let: { educational_details: "$educational_details" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$educational_details"]
                            }
                        }
                    },
                ],
                as: "educational_details"
            }
        },
        {
            $unwind: {
                path: "$educational_details",
                preserveNullAndEmptyArrays: true // Preserve empty arrays
            }
        },
        {
            $lookup: {
                from: "projectdetails",
                let: { project_details: "$project_details" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$project_details"]
                            }
                        }
                    },
                ],
                as: "project_details"
            }
        },
        {
            $unwind: {
                path: "$project_details",
                preserveNullAndEmptyArrays: true // Preserve empty arrays
            }
        },
        {
            $lookup:{
                from:"experiencedetails",
                foreignField:"_id",
                localField:"experience_details",
                as:"experience_details",
                pipeline:[
                    {
                        $project:{
                            owner:0
                        }
                    }
                ]
            }
        },
        // {
        //     $lookup:{
        //         from:"jobs",
        //         foreignField:"_id",
        //         localField:"applied_jobs",
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
            $project:{
                refreshToken:0
            }
        }
    ]);


    // console.log(allDetails);
    res.status(200)
        .json(
            new ApiResponse(200, allDetails[0], "all details fetched successfully")
        )
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")
    // console.log(incomingRefreshToken);
    if (!incomingRefreshToken) {
        throw new ApiError(400, "no refresh token found")
    }

    let userId = null
    await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                throw new ApiError(400, "Given refresh token is expired")
            } else {
                throw new ApiError(401, "Unauthorized token", [err.message])
            }
        } else {
            userId = decoded?._id

        }
    })

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(400, "invalid refresh token")
    }

    // const decodedCookieToken = await jwt.decode(incomingRefreshToken);
    // const decodedDbToken = await jwt.decode(user?.refreshToken);

    //  if( decodedCookieToken._id!==decodedDbToken._id) {
    //     console.log(decodedCookieToken);
    //     console.log(decodedDbToken);
    //     throw new ApiError(401,"refresh token not matching")
    // }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "tokens are updated successfully")
        )
})


export {
    registerUser,
    userVerifed,
    loginUser,
    logoutUser,
    updateCoins,
    userAllDetails,
    refreshAccessToken
}