import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
import { Subscriptions } from "../models/subscription.models.js";
const toggleSubscription=asyncHandler(async(req,res)=>{
    //--logic for toggle subscription--
    //get channelId from req.body
    //get subscriberId from req.user._id
    //check if subscription exists
    //if exists, unsubscribe else subscribe
    //return response 
    const{channelId}=req.body
    const subscriberId=req.user._id
    const exitingsubscription=await Subscriptions.findOne({
       channel: channelId,
    subscriber: subscriberId
    })
    //unsubscribe
    if(exitingsubscription){
        await Subscriptions.findByIdAndDelete(exitingsubscription._id)
          return res.status(200)
          .json(new Apiresponse(200, null, "Unsubscribed successfully") )
     }
   //subscribe
   const newsub=await Subscriptions.create({
    channel: channelId,
    subscriber: subscriberId
   })
   return res.status(200)
          .json(new Apiresponse(200, newsub, "subscribed successfully") )
  
  
})
const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    //--logic for get user channel subscribers--
    //get channelId from req.params
    //find all subscribers for the channel
    //return response with apiresponse
    const{channelId}=req.params
    const subscriber=await Subscriptions.find({channel: channelId})
    return res.status(200)
    .json(new Apiresponse(200,subscriber,"Channel subscribers fetched successfully"))
})
const getSubscribedChannels=asyncHandler(async(req,res)=>{
  //--logic for get subscribed channels--
    //get subscriberId from req.params
    //find all channels for the subscriber
    //return response with apiresponse
    const { subscriberId } = req.params
    const channels=await Subscriptions.find({subscriber:subscriberId}).select('channel');
    return res.status(200)
    .json(new Apiresponse(200,channels,"Subscribed channels fetched successfully"))
})
export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}