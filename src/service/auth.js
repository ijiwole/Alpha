import { StatusCodes } from "http-status-codes";
import { User } from "../models/auth.js";

export const generateAccessAndRefreshTokens = async ( userId ) => {
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.refreshAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return { accessToken, refreshToken}

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    };
};