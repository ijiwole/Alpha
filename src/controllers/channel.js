import { StatusCodes } from 'http-status-codes';
import {User} from '../models/auth.js'; 
import {Channel} from '../models/channel.js'; 
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Video } from '../models/video.js';
import { Subscription } from '../models/subscription.js';


export const createChannel = async (req, res) => {
    try {
        const { name, description, avatar, coverImage } = req.body;
        const userId = req.user.id;

        const existingChannel = await Channel.findOne({ name, owner: userId });
        if (existingChannel) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Channel name already exists",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const newChannel = new Channel({
            owner: userId,
            name,
            description,
            isPublished: false
        });
        await newChannel.save();

        // Add the new channel to the user's channels array
        await User.findByIdAndUpdate(userId, {
            $push: { channels: newChannel._id }
        });

        return res.status(StatusCodes.CREATED).json({
            message: "Channel created successfully",
            data: newChannel,
            status: StatusCodes.CREATED
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to create channel",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const getAllChannels = async ( req, res ) => {
    try {
        
        const userId = req.user.id;

        const channels = await User.find({ owner: userId})

        if(!channels || channels.length == 0){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " No channel found for this user",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: " Channels list fetched successfully",
            data: channels,
            status: StatusCodes.OK,
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get the list of all channels",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const getChannelById = async ( req, res ) => {
    try {
        
        const channelId = req.params;
        
        const channel = await Channel.findById(channelId)

        if(!channel){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Channel id not found ",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: " Channel succsfully fetched ",
            data: channel,
            status: StatusCodes.OK
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to get channel by id",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const updateChannelAssetsAndPublish = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        const updateData = {};

        if (req.files.coverImage) {
            const coverImageResult = await uploadOnCloudinary(req.files?.coverImage[0]?.path);
            updateData.coverImage = coverImageResult.url;
        }
        // Upload avatar if provided
        if (req.files.avatar) {
            const avatarResult = await uploadOnCloudinary(req.files?.avatar[0]?.path);
            updateData.avatar = avatarResult.url;
        }
        // Set channel as published
        updateData.isPublished = true;

        const updatedChannel = await Channel.findByIdAndUpdate(channelId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedChannel) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Channel not found",
                status: StatusCodes.NOT_FOUND,
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Channel updated and published successfully",
            data: updatedChannel,
            status: StatusCodes.OK,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to update and publish channel",
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};

export const deleteChannel = async (req, res ) => {
    try {
        const { channelId } = req.params;
        const userId = req.user._id;

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Channel not found",
                status: StatusCodes.NOT_FOUND,
            });
        }

        if (channel.owner.toString() !== userId.toString()) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "You do not have permission to delete this channel",
                status: StatusCodes.FORBIDDEN,
            });
        }
        
        // Delete the channel
        await Channel.findByIdAndDelete(channelId);

        await Video.deleteMany({ channel: channelId });
        await Subscription.deleteMany({ channel: channelId });

        return res.status(StatusCodes.OK).json({
            message: "Channel deleted successfully",
            status: StatusCodes.OK,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to delete channel",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
