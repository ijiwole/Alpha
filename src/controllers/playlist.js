import { Playlist } from "../models/playlist.js";
import { Video } from "../models/video.js";
import { StatusCodes } from "http-status-codes";


// create playlist
export const createPlaylist = async (req, res) => {
    try {
        // Extract name, description, and videos from request body
        const { name, description } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Name and description are required",
                status: StatusCodes.BAD_REQUEST
            });
        }

        // Extract owner from authenticated user
        const owner = req.headers.id;

        // Create a new playlist
        const newPlaylist = new Playlist({
            name,
            description,
            owner
        });

        // Save the new playlist to the database
        await newPlaylist.save();

        // Respond with the created playlist
        return res.status(StatusCodes.CREATED).json({
            message: "Playlist created successfully",
            data: newPlaylist,
            status: StatusCodes.CREATED
        });

    } catch (error) {
        // Handle any errors that occur
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to create playlist",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

// get user playlist
export const getUserPlaylists = async ( req, res ) => {
    try {
        
        const userId = req.headers;

        const playlists = await Playlist.find({owner : userId});
        if( !playlists || playlists.length == 0 ){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " User Playlists not found ",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "User playlists fetched successfully",
            data: playlists,
            status: StatusCodes.OK
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to create playlist ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

// get a single playlist
export const getPlaylistById = async ( req, res ) => {
        try {
            
            const playlistId = req.params;


            const playlist = await Playlist.findById(playlistId)

            if(!playlist){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: " Playlist not found ",
                    status: StatusCodes.NOT_FOUND
                })
            }

            return res.status(StatusCodes.OK).json({
                message: " Playlist fetched successfully ",
                data: playlist,
                status: StatusCodes.OK
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: " Unable to create playlist ",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
};

// add video to playlist
export const addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { videoId } = req.body;

        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Video not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        // Find the playlist and update it by adding the video ID
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: { videos: videoId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!playlist) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Playlist not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Video added to playlist successfully",
            data: playlist,
            status: StatusCodes.OK
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to add video to playlist",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

// remove video from playlist
export const removeVideosFromPlaylist = async ( req, res ) => {
    try {
        
        const { playlistId } = req.params
        const { videoIds } = req.body;

        if (!Array.isArray(videoIds) || videoIds.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "videoIds must be a non-empty array",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const videos = await Video.find({ _id: { $in: videoIds } });
        if (videos.length !== videoIds.length) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "One or more videos not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {$pull: { videos :{$in: videoIds } }},
            { new: true}
        );

        if( !playlist ){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Playlist not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Video removed from playlist successfully",
            data: playlist,
            status: StatusCodes.OK
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: " Unable to create playlist ",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

//update playlist

export const updatePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Both name and description are required",
                status: StatusCodes.BAD_REQUEST
            });
        }

        // Find the playlist by ID and update the name and description
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { name, description },
            { new: true}
        );

        if (!playlist) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Playlist not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Playlist updated successfully",
            data: playlist,
            status: StatusCodes.OK
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to update playlist",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

// delete playlist

export const deletePlaylist = async( req, res ) => {
    try {

        const { playlistId } = req.params;

        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

        if(!deletedPlaylist){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " Playlist not found ",
                status: StatusCodes.NOT_FOUND
            });
        }
        
        return res.status(StatusCodes.OK).json({
            message: " Playlist deleted successfully",
            status: StatusCodes.OK
        });
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to update playlist",
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
}
