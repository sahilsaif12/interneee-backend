import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        email:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            index:true,
            trim: true,
        },
        coins:{
            type:Number,
            default:1
        },
        personal_details:{
            type:Schema.Types.ObjectId,
            ref:"PersonalDetail"
        },
        educational_details:{
            type:Schema.Types.ObjectId,
            ref:"EducationalDetail"
        },
        project_details:{
            type:Schema.Types.ObjectId,
            ref:"ProjectDetail"
        },
        experience_details:[
            {
                type:Schema.Types.ObjectId,
                ref:"ExperienceDetail"
                
            }
        ],
        applied_jobs:[
            {
                type:Schema.Types.ObjectId,
                ref:"Job"
                
            }
        ],
        
        refreshToken:{
            type:String,
        }
        
    },
    {timestamps:true}
)


userSchema.methods.generateAccessToken= async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generateRefreshToken= async function(){
    return await jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}
export const User=mongoose.model("User",userSchema)