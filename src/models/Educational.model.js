import mongoose,{Schema} from "mongoose";

const educationalDetailsSchema=new Schema(
    {
        instituteType:{
            type:String,
            trim:true,
        },
        instituteName:{
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
        
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        
    },
    {timestamps:true}
)


export const EducationalDetail=mongoose.model("EducationalDetail",educationalDetailsSchema)