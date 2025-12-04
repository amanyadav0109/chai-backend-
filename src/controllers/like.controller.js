import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
import { Like } from "../models/like.models.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId=req.body.userId
    const existingLike=await Like.findOne({
        video :videoId,
        user:userId
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
         return res.status(200)
          .json(new Apiresponse(200, null, "UnLike successfully") )
    }
    newLike=await Like.create({
        video:videoId,
        user:userId
    })
     return res.status(200)
          .json(new Apiresponse(200, newLike, "Like successfully") )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
  const userId=req.body.userId
   const existingLike=await Like.findOne({
        comment:commentId,
        user:userId
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
         return res.status(200)
          .json(new Apiresponse(200, null, "comment UnLike successfully") )
    }
   const newLike=await Like.create({
       comment:commentId,
        user:userId
    })
     return res.status(200)
          .json(new Apiresponse(200, newLike, "comment Like successfully") )


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
  const userId=req.body.userId
   const existingLike=await Like.findOne({
       Tweet:tweetId,
        user:userId
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
         return res.status(200)
          .json(new Apiresponse(200, null, " Tweet UnLike successfully") )
    }
   const newLike=await Like.create({
       Tweet:tweetId,
        user:userId
    })
     return res.status(200)
          .json(new Apiresponse(200, newLike, " Tweet Like successfully") )
})
const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId=req.body.userId
    const likedVideos=await Like.find({
        user:userId,
        video:{$exists:true}
    }).populate({
        path:'video',
        select:" tittle Description thumbnail duration views Owner"
    })
      return res.status(200).json(
        new Apiresponse(200, likedVideos, "Liked videos fetched successfully")
    );
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}