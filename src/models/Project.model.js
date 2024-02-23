import mongoose,{Schema} from "mongoose";

const projectDetailsSchema=new Schema(
    {
        name:{
            type:String,
            trim:true,
        },
        desc:{
            type:String,
            trim:true,
        },
        projectType:{
            type:String,
            trim:true,
        },
        projectLink:{
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


export const ProjectDetail=mongoose.model("ProjectDetail",projectDetailsSchema)