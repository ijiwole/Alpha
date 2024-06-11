import {isValidObjectId} from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import { Video } from "../models/video.js";

export const getAllVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

        // Build filter object based on query and userId
        const filter = {};
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        if (userId) {
            filter.owner = userId;
        }

        const sort = { [sortBy]: sortType === 'asc' ? 1 : -1 };

        const videos = await Video.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        
        const totalVideos = await Video.countDocuments(filter);
        const totalPages = Math.ceil(totalVideos / limit);

        return res.status(StatusCodes.OK).json({
            message: "Videos received successfully",
            data: videos,
            totalPages,
            totalVideos,
            status: StatusCodes.OK
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get all videos",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const publishAvideo = async( req, res ) => {
    try {
        
        const { title, description } = req.body;

        if( !title || !description ){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Both title and description and required ",
                status: StatusCodes.BAD_REQUEST
            });
        }
        // extract the path of the uploaded video file from the request object
        const videoLocalPath = req.files?.videoFile?.[0]?.path;
        
        if(!videoLocalPath){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Video file is required ",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const thumbnailPath = req.files?.thumbnail?.[0]?.path;

        if(!thumbnailPath){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Thumbnail file is required ",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const duration = videoFile.duration;
        const owner = req.user?._id;

        const video = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            duration,
            title,
            description,
            owner
        });
        
        return res.status(StatusCodes.CREATED).json({
            message: " Video published succesfully ",
            data: video,
            status: StatusCodes.CREATED
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to publish video",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const getVideoById = async( req, res ) => {
    try {
        
        const { videoId } = req.params

        if (!isValidObjectId(videoId)){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Invalid video Id ",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const video = await Video.findById(videoId)

        if(!video){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Video not found ",
                status: StatusCodes.NOT_FOUND
            })
        }

        return res.status(StatusCodes.OK).json({
            message: " Video fetched successfully ",
            status: StatusCodes.OK
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get the video",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}

export const updateVideo = async( req, res ) =>{
    try {
        
        const { videoId } = req.params;
        const { title, description } = req.body;

        if(!title && !description){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Either the title or description is required ",
                status: StatusCodes.BAD_REQUEST
            });
        }
        const thumbnailFile = req.files?.thumbnail?.[0] // chweck the thumbnail file in the request object

        if(!thumbnailFile){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Thumbnail file is required ",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const thumbnailLocalPath = thumbnailFile.path;

        // upload thumbnail to cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        
        if(!thumbnail){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error_message: " Error while uploading file to cloudinary ",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
        // update the video details
        const updatedVideo = {};
        if(title) updatedVideo.title = title;
        if(description) updatedVideo.description = description;
        updateFields.thumbnail = thumbnail

       
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $set: updateFields },
            { new :true}
        );

        if(!video){
            return res.status(StatusCodes.NOT_FOUND).json({
                error_message: " Video not found ",
                status: StatusCodes.NOT_FOUND
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to udate video",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteVideo = async( req, res )=> {
    try {

        const { videoId } = req.params;

        if(!isValidObjectId(videoId)){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: " Invalid Video Id",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const video = await Video.findById(videoId);

        if(!video){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Video not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        const videoDeleteResponse = await deleteFromCloudinary(video.videoFile, "video")
        const thumbnailDeleteResponse = await deleteFromCloudinary(video.thumbnail, "image");
        
        if(!videoDeleteResponse || !thumbnailDeleteResponse){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error_message: " Error deleting files from cloudinary",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }

        await Video.findByIdAndDelete(videoId)

        return res.status(StatusCodes.OK).json({
            message: " Video deleted successfully ",
            success: true,
            data : {},
            status: StatusCodes.OK
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to delete video",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const togglePublishStatus = async( req, res ) => {
    try {
        
        const { videoId } = req.params;

        const video = await Video.findById(videoId)

        if(!videoId){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Video not found ",
                status: StatusCodes.NOT_FOUND
            });
        }
        // Update the video's publish status by toggling the isPublished field
        const videoNew = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    isPublished: !video.isPublished  // Toggle the publish status
                }
            },
            { new : true }

        );
        return res.status(StatusCodes.OK).json({
            message: " Publish status toggled successfully ",
            data: videoNew,
            status: StatusCodes.OK
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to toggle published video",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
