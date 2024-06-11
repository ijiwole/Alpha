import express from "express";
import { protect_user } from "../middlewares/auth.js";
import { getSubscribedChannels, getSubscribersList, toggleSubscription } from "../controllers/subscription.js";

const subscriptionRouter = express.Router()
subscriptionRouter.use(protect_user)

subscriptionRouter.route("/toggle/:channelId").post(toggleSubscription);
subscriptionRouter.route("/:channelId").get(getSubscribersList)
subscriptionRouter.route("/:userId").get(getSubscribedChannels)

export default subscriptionRouter