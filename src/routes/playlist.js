import express from "express";
import{ protect_user } from "../middlewares/auth.js" 
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideosFromPlaylist, updatePlaylist } from "../controllers/playlist.js";

const playlistRouter = express.Router()
playlistRouter.use(protect_user);

playlistRouter.route("/create").post(createPlaylist)
playlistRouter.route("/").get(getUserPlaylists)
playlistRouter.route(":/playlistId").get(getPlaylistById)
playlistRouter.route(":/playlistId/add-video").post(addVideoToPlaylist)
playlistRouter.route(":/playlistId/delete-videos").delete(removeVideosFromPlaylist)
playlistRouter.route(":/playlistId/update").put(updatePlaylist)
playlistRouter.route(":playlistId/delete").delete(deletePlaylist)

export default playlistRouter