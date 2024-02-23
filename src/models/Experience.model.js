import mongoose,{Schema} from "mongoose";

const experienceDetailsSchema=new Schema(
    {
        experienceType:{
            type:String,
            trim:true,
        },
        companyName:{
            type:String,
            trim:true,
        },
        companyWebsite:{
            type:String,
            trim:true,
        },
        role:{
            type:String,
            trim:true,
        },
        startDate:{
            type:String,
            trim:true,
        },
        endDate:{
            type:String,
            trim:true,
        },
        coverLetter:{
            type:String,
            trim:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        
    },
    {timestamps:true}
)


export const ExperienceDetail=mongoose.model("ExperienceDetail",experienceDetailsSchema)