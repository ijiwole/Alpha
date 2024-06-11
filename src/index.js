import { config } from 'dotenv';
config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import videoRouter from './routes/video.js';
import channelRouter from './routes/channel.js';
import subscriptionRouter from './routes/subscription.js';
import commentRouter from './routes/comment.js';
import playlistRouter from './routes/playlist.js';
import likeRouter from './routes/like.js';
import dashboardRouter from "./routes/dashboard.js";


const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true, limit:'16kb'}))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/video", videoRouter)
app.use("/api/channel", channelRouter)
app.use("/api/subscribtions", subscriptionRouter)
app.use("/api/comment", commentRouter)
app.use("/api/playlist", playlistRouter)
app.use("/api/like", likeRouter)
app.use("/api/dashboard", dashboardRouter)

const port = process.env.PORT || 3000;

const start = async( ) => {
    await connectDB()
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    }); 
}
start()

