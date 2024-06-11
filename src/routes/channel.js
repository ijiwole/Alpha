import express from 'express';
import { protect_user } from '../middlewares/auth.js';
import { createChannel, deleteChannel, getAllChannels, getChannelById, updateChannelAssetsAndPublish } from '../controllers/channel.js';
import { upload } from '../middlewares/upload.js';

const channelRouter = express.Router()
channelRouter.use(protect_user);

channelRouter.route("/create").post(createChannel)
channelRouter.route("/").get(getAllChannels)
channelRouter.route("/:channelId").get(getChannelById)
channelRouter.route("/publish/:channelId").post(upload.fields([{
     name: 'coverImage', maxCount: 1 },
      { name: 'avatar', maxCount: 1 }]),
       updateChannelAssetsAndPublish)
channelRouter.route("/:channelId").delete(deleteChannel)

export default channelRouter