import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandlers";
import { ApiError } from "../utils/ApiError";
import { uploadCloudinary } from "../utils/cloudinary";
import { Channel } from "../models/channel.model";
import { ApiResponse } from "../utils/ApiResponse";

const createChannel = asyncHandler(async (req, res)=>{
    //check user is login by jwt
    //get Channel name, Channel title, channel dp
    //and create a channel
     const {channelName, channelTitle} = req.body;
     const channelDpLocalPath = req.fields?.channelDp[0].path;
     if(!channelDp && !channelName && !channelTitle){
        throw new ApiError(405, "All fields are required to create a channel");
     }
     const channelDp = await uploadCloudinary(channelDpLocalPath);
     if(!channelDp){throw new ApiError(501, "something went wrong while uploading channel Dp")}
     const channel = await Channel.create({
        channelName: channelName.tolowerCase(),
        channelTitle,
        channelDp: channelDp.url,
        owner: req.user?._id
     })
     if(!channel){throw new ApiError(502, "something went wrong while creating a channel")}

     return res
     .status(200)
     .json(new ApiResponse(200, channel, "Channel created Successfully!"))
})

const updateChannelDetails = asyncHandler(async(req, res)=>{
    const {channelName, channelTitle} = req.body;
    const channelDpLocalPath = req.fields?.channelDp[0].path;
    if(!channelName && !channelTitle && !channelDpLocalPath){throw new ApiError(401, "All fields required")}
    const channelDp = await uploadCloudinary(channelDpLocalPath);
    if(!channelDp){throw new ApiError(501, "something went wrong while uploading a channelDp")}
    
    const channel = await Channel.findByIdAndUpdate(
        req.user?._id,{
            $set: {
                channelName,
                channelTitle,
                channelDp: channelDp.url
            }
        },{new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200, channel, "Update Channel successfully!"))
})
export {
    createChannel,
    updateChannelDetails
}