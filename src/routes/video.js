import express from "express"
import { protect_user } from "../middlewares/auth.js"
import { deleteVideo, getAllVideos, getVideoById, publishAvideo, togglePublishStatus, updateVideo } from "../controllers/video.js"
import { upload } from "../middlewares/upload.js"

const videoRouter = express.Router()
videoRouter.use(protect_user)

videoRouter.route("/").get(getAllVideos);
videoRouter.route("/publish ").post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
]), publishAvideo
);
videoRouter.route("/:videoId").get(getVideoById);
videoRouter.route("/:videoId").delete(deleteVideo);
videoRouter.route("/:videoId").patch(upload.single("thumbnail"), updateVideo);
videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default videoRouter