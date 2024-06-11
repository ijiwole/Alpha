import { StatusCodes } from "http-status-codes";
import { Comment } from "../models/comment.js";


export const getAllComments = async ( req, res ) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { videoId } = req.params;

        const match = {};
        if (videoId) {
            match.video = videoId;
        }
        // create an aggregation pipeline
        const aggregate = Comment.aggregate([
            { $match: match }, 
            {
                $lookup: { // get owner dets from user collection
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            { $unwind: '$owner' }, // flatten the owner array
            {
                $project: { // select required fields to be returned
                    content: 1,
                    owner: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                    },
                    video: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        // pagination options 
        const options = {
            page: parseInt(page, 10), // convert page to integer
            limit: parseInt(limit, 10),
        };

        const comments = await Comment.aggregatePaginate(aggregate, options);

        return res.status(StatusCodes.OK).json({
            message: 'Comments fetched successfully',
            data: comments.docs,
            totalComments: comments.totalDocs,
            totalPages: comments.totalPages,
            currentPage: comments.page,
            status: StatusCodes.OK,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Unable to fetch comments',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const addComment = async ( req, res ) => {
    try {
        
        const { content, videoId } = req.body;

        const userId = req.user._id;

        if(!content || !videoId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Content and video ID are required",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const newComment = new Comment({
            content,
            video: videoId,
            owner: userId
        })
        await newComment.save()

        //replace the owner field with the actual user document, but only including the username and avatar fields.
        await newComment.populate('owner', 'username avatar').execPopulate()
        
        return res.status(StatusCodes.CREATED).json({
            message: "Comment added successfully",
            data: newComment,
            status: StatusCodes.CREATED
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Unable add comment',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const updateComment = async ( req, res ) => {
    try {
        
        const { commentId } = req.params;
        const { content  } = req.body;

        if(!content) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Content is required",
                status: StatusCodes.BAD_REQUEST
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {content},
            { new: true }
        ).populate('owner', 'username avatar')

        if (!updatedComment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Comment not found",
                status: StatusCodes.NOT_FOUND
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Comment updated successfully",
            data: updatedComment,
            status: StatusCodes.OK
        }); 

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Unable update comment',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteComment = async ( req, res ) => {
    try {

        const { commentId } = req.params;

        const deletedComment = await Comment.findByIdAndDelete(commentId)

        if(!deletedComment){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: " comment cannot be deleted",
                status: StatusCodes.NOT_FOUND
            });
        }
        return res.status(StatusCodes.OK).json({
            message: " Comment deleted successfully",
            status: StatusCodes.OK
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Unable to delete comment',
            status: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};