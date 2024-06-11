import { StatusCodes } from "http-status-codes";
import { Like } from "../models/like.js";
import { Video } from "../models/video.js"
 
// Toogle like video

export const toggleLikeVideo = async ( req, res ) => {
    try {
        
        const videoId = req.params;

        const userId = req.headers

        const video = await Video.findById(videoId);
        if(!video){
            return  res.status(StatusCodes.NOT_FOUND).json({
                message: 'Video not found',
                status: StatusCodes.NOT_FOUND
            });
        }
        
        const existingLike = await Like.findOne({
            video: videoId,
            likedBy: userId
        });

        if(existingLike){
            await Like.findByIdAndDelete(existingLike._id);
            return res.status(StatusCodes.OK).json({
                message: 'Like removed successfully',
                status: StatusCodes.OK
            });
        }else{
            const newLike = new Like({
                video: videoId,
                likedBy: userId
            });
            await newLike.save();
            return res.status(StatusCodes.OK).json({
                message: 'Like added successfully',
                status: StatusCodes.OK
            });
        }
    } catch (error) {
        return res.Status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to toggle like video ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
};

// toogle like comment

export const toggleLikeComment  = async ( req, res ) => {
    try {

        const commentId = req.params;
        const userId = req.headers;

        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Comment not found ",
                status: StatusCodes.NOT_FOUND
            });
        }

        const existingLike = await Comment.findOne({
            likedBy: userId,
            comment: commentId
        })

        if(existingLike){
            await Like.findByIdAndDelete(commentId)
            return res.status(StatusCodes.OK).json({
                message: " Comment unliked successfully ",
                status: StatusCodes.OK
            });
        }else{
            const newComment = new Like({
                comment: commentId,
                likedBy: userId
            });
        }
        await Like.save();
        return res.status(StatusCodes.OK).json({
            message: " Comment Liked successfully ",
            status: StatusCodes.OK
        });

    } catch (error) {
        return res.Status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to toggle like comment ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
};

// get all liked videos

export const getAllLikedVideos = async( req, res ) => {
    try {
        
        const userId = req.headers;

    
        const likes = await Like.find({ 
            likedBy: userId, 
            video: { $exists: true } }).populate('video');

            // create an array of liked livdeos
        const likedVideos = likes.map(like => like.video);

        return res.status(StatusCodes.OK).json({
            message: 'Liked videos fetched successfully',
            data: likedVideos,
            status: StatusCodes.OK
        });

    } catch (error) {
        return res.Status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to fetch all likeed videos ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
};