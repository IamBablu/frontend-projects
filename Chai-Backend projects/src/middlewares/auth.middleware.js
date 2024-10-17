import { asyncHandler } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyJwt =  asyncHandler(async (req, _, next)=>{
    try {
        const token = req.cookies?.accessToken || header("Authorization")?.replace("Bearer ","")
        if(!token){throw new ApiError(401, "Unauthorized request")}
        // console.log("decoded token is", token, process.env.ACCESS_TOKEN_SECRET);
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        // console.log("decoded token is", decodedToken);
        

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){throw new ApiError(401, "Invalid Access Token")}
        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(400,error.massage || "Invalid access token")
    }
})
const verifyChannel = asyncHandler(async (req, res, next)=>{
    try {
        const {ChannelId} = req.params;
        if(!ChannelId){throw new ApiError(401, "Unauthorized request")}
        const channel = await Channel.findById(ChannelId)
        if(!channel){throw new ApiError(401, "Channel not exist")}
        req.channel = channel;
        next();
    } catch (error) {
        throw new ApiError(400, error.massage || "Invalid Channel Name")
    }
})

export {verifyJwt, verifyChannel}