import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/auth.js";
config();

export const protect_user = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized Request",
                status: 401
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({
                message: "Invalid Access Token",
                status: 401
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized Request",
            status: 401
        });
    }
};
