import mongoose, {isValidObjectId} from "mongoose";
import {asyncHandler} from "../utils/asyncHandlers";
import {Video} from "../models/video.model";
import {ApiError} from "../utils/ApiError";
import {uploadCloudinary} from "../utils/cloudinary";
import {ApiResponse} from "../utils/ApiResponse";

const getAllVideoOfChannel = asyncHandler(async (req, res) => {
  const {page = 1, limit = 10, channelId} = req.query;
  if (!channelId) {
    throw new ApiError(404, "channel Id required");
  }
  const video = await Video.aggregate([
    {
      $lookup: {
        from: "Channel",
        localField: "owner",
        foreignField: "_id",
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        owner: 1,
      },
    },
  ]).select(`-${Video.isPublished === false}`);
});
const uploadVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req.files?.video[0].path;
  const thumbLocalPath = req.files?.thumbnail[0].path;
  if (!videoLocalPath && !thumbLocalPath) {
    throw new ApiError(402, "Video or Thumbnail is missing");
  }
  const {title, description, isPublished} = req.body;
  if (!title && !description) {
    throw new ApiError(402, "all fields required while uploading video");
  }
  const videoUrl = await uploadCloudinary(videoLocalPath);
  const thumbnail = await uploadCloudinary(thumbLocalPath);
  if (!videoUrl && !thumbnail) {
    throw new ApiError(
      500,
      "Something went wrong while uploading video or thumbnail"
    );
  }

  const video = await Video.create({
    videoFile: videoUrl.url,
    title,
    description,
    thumbnail: thumbnail.url,
    owner: req.channel?._id,
    isPublished,
    views,
    duration: videoUrl.duration,
  });
  const uploadedVideo = await video.findById(video._id);
  if (!uploadVideo) {
    throw new ApiError(500, "Something went wrong while uploading a video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Uploaded successfully!"));
});
const getVideoById = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  if (!videoId) {
    throw new ApiError(401, "Video Id is missing");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not available");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video find successfully"));
});
const updateVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  const videoLocalPath = req.files?.video[0].path;
  const thumbLocalPath = req.files?.thumbnail[0].path;
  if (!videoLocalPath && !thumbLocalPath) {
    throw new ApiError(402, "Video or Thumbnail is missing");
  }
  const {title, description, isPublished} = req.body;
  if (!title && !description) {
    throw new ApiError(402, "all fields required while uploading video");
  }
  const videoUrl = await uploadCloudinary(videoLocalPath);
  const thumbnail = await uploadCloudinary(thumbLocalPath);
  if (!videoUrl && !thumbnail) {
    throw new ApiError(
      500,
      "Something went wrong while uploading video or thumbnail"
    );
  }
  const newVideo = await Video.findByIdAndUpdate(videoId, {
    $set: {
      title,
      description,
      isPublished,
      videoFile: videoUrl.url,
      thumbLocalPath: thumbnail.url,
      owner: req.channel?._id,
      views,
      duration: videoUrl.duration,
    }},
    {new: true})
  return res
  .status(200)
  .json(new ApiResponse(200, newVideo, "video change successfully"))
});
const deleteVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    if(!videoId){throw new ApiError(401, "video id is missing")}
    const newVideoInfo = await Video.deleteOne({_id: videoId})
    if(!newVideoInfo){throw new ApiError(500,"something went wrong while deleting a video")}
    return res
    .status(200)
    .json(new ApiResponse(200, newVideoInfo, "video deleted successfully"))
})

const togglePublishVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    if(!videoId){throw new ApiError(401, "videoId is missing")}
   try {
     // const video = await Video.aggregate([
     //     {
     //         $match: {
     //             _id: new mongoose.Types.ObjectId(videoId)
     //         }
     //     },
     //     {
     //         isPublished: {
     //             $cond: {
     //                 if: isPublished, then: false, else: true
     //             }
     //         }
     //     }
     // ])
     const video = await Video.findByIdAndUpdate(
         videoId,
         {
             isPublished: {
                 $cond: {
                     if: isPublished, then: false, else: true
                 }
             }
         },{new: true}
     )
   } catch (error) {
    throw new ApiError(500, error.massage || "something went wrong")
   }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "togglePublish Successfully"))
})
export {getAllVideoOfChannel, uploadVideo, getVideoById, updateVideo, deleteVideo, togglePublishVideo};
