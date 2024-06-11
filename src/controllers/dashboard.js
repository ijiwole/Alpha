import { Channel } from "../models/channel.js"
import { Video } from "../models/video.js"
import { Like } from "../models/like.js"
import{ Subscription } from "../models/subscription.js"
import { StatusCodes } from "http-status-codes"



export const getChannelStats = async ( req, res ) => {
    try {
        
        const {channelId} = req.params;

        const channel = await Channel.findById(channelId);
        if(!channel){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Channel not found',
                status: StatusCodes.NOT_FOUND,
            });
        }

        const videoCount = await Video.countDocuments({ owner: channelId})
        const subscriberCount = await Subscription.countDocuments({ channel: channelId})
        const likeCount = await Like.countDocuments({ channel: channelId})

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;

        const skip = ( page - 1 ) * limit;

        const mostLikedVideos = await Video.find({ owner: channelId })
        .sort({ likes: -1})// descending order
        .skip(skip)
        .limit(10)

        return res.status(StatusCodes.OK).json({
            message: " Channel Stats fetched successfully",
            data:{
                videoCount,
                subscriberCount,
                likeCount,
                mostLikedVideos,
                page,
                totalPages: Math.ceil(videoCount/limit)
            },
            status: StatusCodes.OK
        })  
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get channel Stats",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        })
    }
};

export const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { page = 1, limit = 10, sortBy = 'views' } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { [sortBy]: -1 } 
        };

        const videos = await Video.paginate({ owner: channelId }, options);

        if (!videos) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No videos found for this channel',
                status: StatusCodes.NOT_FOUND,
            });
        }
        
        // Fetch total likes count for all videos of the channel
        const likeCount = await Like.aggregate([
            { $match: { channel: channelId } },
            { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
        ]);

        const formattedVideos = videos.docs.map(video => ({
            _id: video._id,
            title: video.title,
            thumbnail: video.thumbnail, 
            duration: video.duration, 
            description: video.description,
            views: video.views,
            likes: video.likes
        }));

        return res.status(StatusCodes.OK).json({
            message: "Channel videos fetched successfully",
            data: {
                videos: formattedVideos,
                totalPages: videos.totalPages,
                currentPage: videos.page,
                totalVideos: videos.totalDocs,
                likeCount: likeCount.length > 0 ? likeCount[0].totalLikes : 0
            },
            status: StatusCodes.OK
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get channel Videos",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};