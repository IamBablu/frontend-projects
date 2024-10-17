import mongoose, {Schema} from "mongoose";
import { User } from "./user.model";

const channelSchema = new Schema({
    channelName : {
        type: String,
        required: true
    },
    channelTitle: {
        type: String,
        required: true
    },
    channelDp: {
        type: String,
        required: true
    },
    numberOfSubscribers : {
        type: Number,
        default: 0
    },
    numberOfSubscription: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Channel = mongoose.model("Channel", channelSchema)