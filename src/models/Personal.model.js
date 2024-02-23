import mongoose,{Schema} from "mongoose";

const personalDetailsSchema=new Schema(
    {
        mobile:{
            type:String,
            trim:true,
        },
        avatar:{
            type:String,
            trim:true,
        },
        linkedInLink:{
            type:String,
            trim:true,
        },
        githubLink:{
            type:String,
            trim:true,
        },
        resume:{
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


export const PersonalDetail=mongoose.model("PersonalDetail",personalDetailsSchema)