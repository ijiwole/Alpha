import { Subscription } from "../models/subscription.js";
import { StatusCodes } from "http-status-codes";

// Toggle subscriptions
export const toggleSubscription = async ( req, res ) => {
    try {
        
        const { channelId } = req.params;
        const userId = req.headers

        // check if subscription exist
        const existingSubscription = await Subscription.findOne({
            subscriber: userId,
            channel: channelId
        })
        if(existingSubscription){
            await Subscription.findByIdAndDelete(existingSubscription._id);
            return res.status(StatusCodes.OK).json({
                message: " unsubscribed sucessfully ",
                status: StatusCodes.OK
            });
        }else{
            const newSubscription = new Subscription({
                subscriber: userId,
                channel: channelId
            });
            await newSubscription.save();
            return res.status(StatusCodes.OK).json({
                message: " Subscribed Successfully ",
                status: StatusCodes.OK
        });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to toogle subscription ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}

//Get subscriber's list of a channel
export const getSubscribersList = async( req, res ) => {

    try {
        const { channelId } = req.params;

        const subscriptions = await Subscription.find({ channel: channelId}).populate('subscriber', 'fullname', 'avatar');

    if(!subscriptions || subscriptions.length == 0){
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "No subscribers found for this channel",
            status: StatusCodes.NOT_FOUND,
        });
    }
    // extract subscriber info 
        const subscribers = subscriptions.map(sub => sub.subscriber);

         return res.status(StatusCodes.OK).json({
            message: "Subscribers list fetched successfully",
            data: subscribers,
            status: StatusCodes.OK,
         });
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to fetch subscribers list",
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    
}

// Get channel list to which user has subscribed
export const getSubscribedChannels = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find subscriptions for the given user (subscriber)
        const subscriptions = await Subscription.find({ subscriber: userId }).populate('channel', 'fullName username avatar');

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User has not subscribed to any channels",
                status: StatusCodes.NOT_FOUND,
            });
        }

        // Extract channel information
        const subscribedChannels = subscriptions.map(sub => sub.channel);

        return res.status(StatusCodes.OK).json({
            message: "Subscribed channels list fetched successfully",
            data: subscribedChannels,
            status: StatusCodes.OK,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to fetch subscribed channels list",
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};