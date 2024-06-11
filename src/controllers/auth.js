import mongoose from "mongoose";
import { User } from "../models/auth.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'

const generateAccessAndRefreshTokens = async ( userId ) => {
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
export const register = async ( req, res ) => {
        try {
            
            const { fullname, email, username, password} = req.body;

            if(!fullname || !email || !username || !password) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message:"All fields are required",
                    status:StatusCodes.BAD_REQUEST
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash( password, saltRounds)

            const existingUser = await User.findOne({
                $or: [{ username}, {email}]
            })

            if(existingUser){
                return res.status(StatusCodes.CONFLICT).json({
                    message: "User already exists",
                    status: StatusCodes.CONFLICT
                });
            }

            const avatarLocalPath = req.files?.avatar[0]?.path;

            let coverImgaeLocalPath;
            
            if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
                coverImgaeLocalPath = req.files.coverImage[0].path
            }

            if(!avatarLocalPath){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Avatar file required",
                    status: StatusCodes.BAD_REQUEST
                })
            }

            const avatar = await uploadOnCloudinary(avatarLocalPath)
            if(!avatar){
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Avatar file required",
                    status: StatusCodes.BAD_REQUEST
                });
            }
            const coverImage = await uploadOnCloudinary(coverImgaeLocalPath)
            if(!coverImage.url){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Error while uploading on avatar",
                    status: StatusCodes.BAD_REQUEST
                });
            }

            const user = await User.create({
                fullname,
                avatar: avatar.url,
                coverImage: coverImage.url,
                email,
                password: hashedPassword,
                username: username.toLowerCase()
            })
            user.save()

            const createdUser = await User.findById(user._id).select("-password -refreshToken")
            if(createdUser){
                return res.status(StatusCodes.CREATED).json({
                    message: "User created Successfully",
                    status: StatusCodes.CREATED
                })
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Registration not successful",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            })
        }
};

export const login = async ( req, res ) => {
    try {
        
        const { email, password} = req.body;
        
        if(!email || !password){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email and Password required",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const user = await User.findOne({
            $or: [{ username}, {email}] 
        })
        if(!user){
            return res.status(StatusCodes.CONFLICT).json({
                message: "User not found",
                status: StatusCodes.CONFLICT
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Incorrect Password",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        message: "Login Successful",
        user: loggedInUser,
        status: StatusCodes.OK
    })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Login not successful",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
}

export const logout = async( req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true}
    )

    const options = {
        htppOnly: true,
        secure: true
    }
    return res
    .status(StatusCodes.OK)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json({
        message: "Logout Successful",
        status: StatusCodes.OK
    });
}
 

export const refreshAccessToken = async( req, res ) => {
    // get an incoming refresh token
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Unauthorized Request",
            status: StatusCodes.UNAUTHORIZED
        });
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // fetch the user whose id matches the id of the decoded token
        const user = await User.findById(decodedToken?._id)

        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid Refresh Token",
                status: StatusCodes.UNAUTHORIZED
            });
        }

        if(incomingRefreshToken !== user.refreshToken){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Refresh token used or expired",
                status: StatusCodes.UNAUTHORIZED
            });
        }

        const options ={
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res.status(StatusCodes.OK)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "Access Token refreshed",
            status: StatusCodes.OK
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Invalid refresh token",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
}

export const changePassword = async ( req, res )=> {
    try {
        
        const { oldPassword, newPassword} = req.body;

        const user = await User.findById(req.user?._id)
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({
                messgae: " Invalid User Id ",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
        
        if(!isPasswordCorrect){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Invalid old password ",
                status: StatusCodes.BAD_REQUEST

            });
        }

        user.password = newPassword
        await user.save()

        return res.status(StatusCodes.ACCEPTED).json({
            message: " password chaged successfully ",
            status: StatusCodes.ACCEPTED
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to change user password",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
}


export const getSingleUser = async( req, res ) => {
    try {
        
        const id = req.headers.id;

        const user = await User.findById(id);
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid User ID",
                status: StatusCodes.BAD_REQUEST
            });
        }else{
            return res.status(StatusCodes.OK).json({
                message: "User fetched",
                data: user,
                status: StatusCodes.OK
            })
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to fetch user",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
}

export const updateUserProfile = async( req, res )=> {
    try {

        const { email , fullname } = req.body;

        if(!email || ! fullname){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " All fields are required",
                status: StatusCodes.BAD_REQUEST 
            });
        }

        const user = await User.findByIdAndUpdate(req.user?._id);
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                message:" User not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.ACCEPTED).json({
            messgae: "User profile  updated",
            status: StatusCodes.ACCEPTED
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to update user profile",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}

export const updateUserAvatar = async ( req, res) => {
    try {   

        const avatarLocalPath = req.file?.path

        if(!avatarLocalPath){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Avatar file missing",
                status: StatusCodes.NOT_FOUND
            })
        }
        
        const user = await User.findByIdAndUpdate(req.user?._id,{
            $set:{
                avatar: avatar.url
            }
        }, {new: true}).select("-password")

        return res.status(StatusCodes.ACCEPTED).json({
            message: " User avatar updated successfully ",
            data: user,
            status: StatusCodes.ACCEPTED
        });


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to update user avatar",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}

export const updateUserCoverImage = async ( req, res ) => {
    try {
        
        const coverImgaeLocalPath = req.file?.path;

        if(!coverImgaeLocalPath){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Cover image file not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        // delete old image 
        if(user.coverImage){
            await deleteFromCloudinary(user.coverImage, "image");
        } 
        const coverImage = await uploadOnCloudinary(coverImgaeLocalPath)
        
        if(!coverImage.url){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Error while uploding to cloduinary",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user?.id,
            {
                $set: { coverImage: coverImage.url}
            },
            {new: true}
        ).select("-password")   
        return res.status(StatusCodes.ACCEPTED).json({
            message: "Cover image updated successfully",
            data: user,
            status: StatusCodes.ACCEPTED
        })       
        
    } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Unable to update user cover image",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    
}

export const getUserChannelProfile = async (req, res) => {
    try {
        // Extract the username from the request parameters
        const { username } = req.params;

        // Check if the username is provided, if not, return a BAD_REQUEST response
        if (!username) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Username does not exist",
                status: StatusCodes.BAD_REQUEST
            });
        }

        // Perform an aggregation operation to get the user channel profile
        const channel = await User.aggregate([
            {
                // Match the user document based on the provided username (case insensitive)
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                // Lookup to find the subscriptions where the user is the channel
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                // Lookup to find the subscriptions where the user is the subscriber
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                // Add additional fields to the resulting documents
                $addFields: {
                    // Count the number of subscribers
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    // Count the number of channels the user is subscribed to
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    // Check if the current user is subscribed to this channel
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                // Project (include) only specific fields in the output
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]);

        // Check if the channel exists, if not, return a BAD_REQUEST response
        if (!channel?.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Channel does not exist",
                status: StatusCodes.BAD_REQUEST
            });
        }

        // Return a successful response with the channel profile
        return res.status(StatusCodes.OK).json({
            message: "User Channel fetched successfully",
            status: StatusCodes.OK,
            data: channel[0]
        });

    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get user channel profile",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const getWatchHistory = async (req, res) => {
    try {
        // Aggregate the User collection to find the user's watch history
        const user = await User.aggregate([
            {
                // Match the user by their ID
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user?._id)
                }
            },
            {
                // Lookup to find the videos in the user's watch history
                $lookup: {
                    from: "video", // Reference to the video collection
                    localField: "watchHistory", // Field in the User collection
                    foreignField: "_id", // Field in the Video collection
                    as: "watchHistory", // Alias for the joined documents
                    pipeline: [
                        {
                            // Lookup to find the owner details for each video
                            $lookup: {
                                from: "users", // Reference to the users collection
                                localField: "owner", // Field in the Video collection
                                foreignField: "_id", // Field in the Users collection
                                as: "owner", // Alias for the joined documents
                                pipeline: [
                                    {
                                        // Project specific fields to include in the output
                                        $project: {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            // Add the owner details to the video document
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        // Check if the user has a watch history
        if (!user || !user.length) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No watch history found for user",
                status: StatusCodes.NOT_FOUND
            });
        }

        // Return the user's watch history in the response
        return res.status(StatusCodes.OK).json({
            message: "User watch history fetched successfully",
            status: StatusCodes.OK,
            data: user[0].watchHistory // Return the watch history array
        });

    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to fetch user watch history",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
