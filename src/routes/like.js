import express from "express";
import {protect_user} from "../middlewares/auth.js"
import { getAllLikedVideos, toggleLikeComment, toggleLikeVideo } from "../controllers/like.js";

const likeRouter = express.Router()
likeRouter.use(protect_user)


likeRouter.route("/:videoId").post(toggleLikeVideo)
likeRouter.route("/:commentId").post(toggleLikeComment)
likeRouter.route("/videos").post(getAllLikedVideos)

export default likeRouter;