import express from "express";
import { protect_user } from "../middlewares/auth.js"
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.js";

const dashboardRouter = express.Router()
dashboardRouter.use(protect_user)

dashboardRouter.route("/channels/channelId/stats").get(getChannelStats)
dashboardRouter.route("/channels/channelId/videos").get(getChannelVideos)

export default dashboardRouter;