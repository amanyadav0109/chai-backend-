import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
import {Tweet} from "../models/tweet.models.js";
const createTweet=asyncHandler(async(req,res)=>{
//take data from user 
//check validation user
//if user exist create tweet account
//return response
const userId=req.user._id
const {content}=req.body
if(!content){
    throw new ApiErrors("content is required")
}
const tweet=await Tweet.create({
    content,
    owner:userId
})
return res.status(200)
 .json(new Apiresponse(200,tweet,"tweet created successfully"))

})
const getUserTweet=asyncHandler(async(req,res)=>{
//get userid from req.params
//find user by id
//check validation
//find tweets by user id
//return response
const userId=req.params.userId
const user=await User.findById(userId);
    if(!user){
         throw new ApiErrors(404,"User not found");
    }
const tweets=await Tweet.findById(userId)
return res.status(200)
.json(new Apiresponse(200,tweets,tweets.length,"User tweets fetched successfully"))

})
const updateTweet=asyncHandler(async(req,res)=>{
//get tweetid from req.params
//get content from req.body
//find tweet by id
//check validation
//update tweet content
//return response
const tweetId=req.params.tweetId
const userId=req.user._id;
const {content}=req.body
if (!content) {
    throw new ApiErrors(400, "Tweet content is required");
}
const tweet=await Tweet.findOneAndUpdate(
   {  
    _id:tweetId,
     owner:userId
   },
   {
    $set:{content}
   },{new :true}
)
if (!tweet) {
    throw new ApiErrors(404, "Tweet not found or unauthorized");
  }

  return res.status(200)
  .json(new Apiresponse(200,tweet,"User tweets update successfully"))
  });
const deleteTweet=asyncHandler(async(req,res)=>{
const tweetId=req.params.tweetId
const userId = req.user._id;
 const tweet = await Tweet.findOneAndDelete({
  _id: tweetId,
  owner: userId
});
     if (!tweet) {
    throw new ApiErrors(404, "tweet not found");
  }
  return res.status(200)
  .json(new Apiresponse(200,tweet,"User tweets delete successfully"))
  
})
export{
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}
