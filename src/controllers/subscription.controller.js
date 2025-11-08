import {User} from "../models/user.models";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { Subscriptions } from "../models/subscription.model.js";
const toggleSubscription=asyncHandler(async(req,res)=>{
     const{channelId}=req.body
})
const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const{channelId}=req.params
})
const getSubscribedChannels=asyncHandler(async(req,res)=>{
    const { subscriberId } = req.params
})
export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}