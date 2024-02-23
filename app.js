import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(cookieParser())
app.use(express.json({limit:'20kb'}))
app.use(express.urlencoded({extended:true,limit:'20kb'}))
app.use(express.static("public"))

app.get('/',(req, res) => {

    res.json({msg:"hello anchors task backend is working"})
})

// // importing routes
import userRouter from './src/routes/user.route.js'
import jobRouter from './src/routes/job.route.js'
import updateRouter from './src/routes/update.route.js'

app.use("/api/v1/users",userRouter)
app.use("/api/v1/jobs",jobRouter)
app.use("/api/v1/update",updateRouter)

export default app