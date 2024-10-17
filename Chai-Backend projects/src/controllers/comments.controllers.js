import mongoose from "mongoose";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandlers";

const addComment = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const {commentSms} = req.query
    if(!videoId){throw new ApiError(500, "Something went wrong while creating comment")}
    if(!commentSms){throw new ApiError(500, "Something went wrong while creating comment")}

    const comment = await Comment.create(
        {
            content: commentSms,
            video: videoId,
            owner: req.user?._id
        });
        if(!comment){throw new ApiError(500, "Something went wrong while creating comment")}
    return res
    .status(200)
    .json(new  ApiResponse(200, comment, "commented successfully"))
})

const getVideoComment = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const comment = await Comment.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "owner",
                foreignField: "_id",
                as: "comments"
            }
        },
        {
            $project: {
                comments: 1
            }
        }
    ])
    if(!comment?.length){throw new ApiError(501,"comments not found")}
    return res
    .status(200)
    .json(new ApiResponse(200, comment[0], "comments fetched successfully"))
})
const updateComments = asyncHandler(async(req, res)=>{
    const {commentId} = req.params
    const {content} = req.query
    if(!commentId && !content){throw new ApiError(401, "all field required")}
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content
            }
        },
        {new : true}
    )
    if(!comment){throw new ApiError(500, "Something went wrong while updating comment")}
    return res
    .status(200)
    .json(new ApiResponse(200, comment ,"comment update successfully"))
})

const deleteComment = asyncHandler(async(req, res) => {
    const { commentId } = req.params
    if(!commentId){throw new ApiError(401, "commentId is missing")}
    const comment = await Comment.deleteOne({_id: commentId})
    if(!comment){throw new ApiError(500,"comment is not deleted")}
    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment is deleted successfully"))
})

export {
    addComment,
    getVideoComment,
    updateComments,
    deleteComment
}