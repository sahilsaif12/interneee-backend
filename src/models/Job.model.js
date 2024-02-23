import mongoose,{Schema} from "mongoose";

const jobSchema=new Schema({

    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: { type: String, required: true },
    datePosted: { type: String },
    salaryRange: { type: Number, required: true },
    jobProviders: [
      {
        jobProvider: { type: String},
        url: { type: String}
      }
    ]
},{timestamps:true}
);

export const Job=mongoose.model("Job",jobSchema)
