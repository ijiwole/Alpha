import express from "express";
import { changePassword, getSingleUser, getUserChannelProfile, getWatchHistory, login, logout, refreshAccessToken, register, updateUserAvatar, updateUserCoverImage, updateUserProfile } from "../controllers/auth.js"
import { protect_user } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router()

authRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    register   
);
authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
authRouter.route("/logout").post(logout)
authRouter.route("/changePassword").post(changePassword)
authRouter.route("/getSingleUser", ).post(protect_user, getSingleUser)
authRouter.route("refresh-token").post(refreshAccessToken)
authRouter.route("/update-profile").patch(protect_user, updateUserProfile)
authRouter.route("/avatar").patch(protect_user, upload.single("avatar"), updateUserAvatar)
authRouter.route("/cover-image").patch(protect_user, upload.single("coverImage"), updateUserCoverImage)
authRouter.route("/c/:username").get(protect_user, getUserChannelProfile)
authRouter.route("/watch-history").get(protect_user, getWatchHistory)

export default authRouter