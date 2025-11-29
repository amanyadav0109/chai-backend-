import { Video } from "../models/video.models.js";
import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js"
import {uploadOncloudinary} from "../utilis/Cloudinary.js";
const getAllvideos=asyncHandler(async(req,res)=>{ 
    //--logic for getAllvideos--
    //get page, limit, query, sortBy, sortType, userId from req.body
    //search that video in searchbar with tittle and description field
    //if userId is present filter by userId
    //sort the video by sortby and sorttype
    //paginate the video by page and limit
    // Fetch videos with filters, sorting, and pagination
    //return the video list with total count
    // return response with apiresponse
    
    const { page = 1, limit = 10, query, sortBy, sortType, userId }=req.body
    if(userId){
        const user=await User.findById(userId);
        if(!user){
            throw new ApiErrors(404,"User not found");
        }
    }
    const filter={
        $or:[
            {tittle:{$regex:query,$options:"i"}},
            {Description:{$regex:query,$options:"i"}}
        ]
    };
    if(userId){
        filter.Owner=userId
    }
    const sortOrder=sortType==="asc"?1:-1;
    const sortOptions={[sortBy]:sortOrder}
    
    const skip=(page-1)*limit

    const videos=await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
   
    const totalVideos= await Video.countDocuments(filter);

    return res.status(200)
    .json(new Apiresponse(200,{
        videos,
        totalVideos,
        currentPage:Number(page),
        totalPages: Math.ceil(totalVideos/limit)
    },"Videos fetched successfully"))


})
const publishAVideo =asyncHandler(async(req,res)=>{
    //--logic for publishvideo--
    //get tiitle,description from req.body
    //get video path from req.files
    //upload video on cloudnary
    //save video in database
    //return response with apiresponse
    const{tittle,Description}=req.body
    const userId=req.user._id
    if(!tittle||!Description){
        throw new ApiErrors(400,"tittle and description are required")
    }
    const videoPath=req.files?.videoFile?.[0]?.path;
    const thumbnailsPath=req.files?.thumbnails?.[0]?.path;
    
   if (!videoPath || !thumbnailsPath) {
    throw new ApiErrors(400, "Video file and thumbnail are required");
  }

    const uploadvideo=await uploadOncloudinary(videoPath,"video")
    const uploadthumbnails=await uploadOncloudinary(thumbnailsPath,"thumbnails")
    if(!uploadOncloudinary){
        throw new ApiErrors(500,"video upload failed")
    }
    
    const newvideo= await Video.create({
        tittle,
        Description,
        videoFile:uploadvideo.secure_url,
        thumbnails:uploadthumbnails.secure_url,
        Owner:userId
    })
    return res
    .status(200)
    .json(new Apiresponse(200,newvideo,"Video published successfully"))
})
const getVideoById=asyncHandler(async(req,res)=>{
    //-- getvideo logic --
    //Take video ID from request (req.params.id)
    //check validation of that videoId
    //fetch video from database
    //return response with apiresponse
    
    const{videoId}=req.params

    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiErrors(404,"Video not found")
    }
    return res 
    .status(200)
    .json(new Apiresponse(200,video,"Video fetched successfully"))
})
const updateVideo=asyncHandler(async(req,res)=>{
    //--logic for update video--
    //get videoId from req.params
    //get tittle,description from req.body
    //find video by id and update
    //return response with apiresponse
    const {videoId}=req.params
    const {tittle,Description}=req.body
     if(!tittle || !Description){
    throw new ApiErrors(400,"tittle & Description are required")
  }
    const video=await Video.findByIdAndUpdate(
       videoId,
         {$set:{
                 tittle,
                 Description
                }
         },{new:true}
    )
      if (!video) {
    throw new ApiErrors(404, "Video not found");
  }
   return res 
   .status(200)
   .json(new Apiresponse(200,video,"Video updated successfully"))
})
const deleteVideo =asyncHandler(async(req,res)=>{
    //--logic for delete video--
    //get videoId from req.params
    //find video by id and delete
    //return response
    const {videoId}=req.params
    const video=await Video.findByIdAndDelete(videoId)
     if (!video) {
    throw new ApiErrors(404, "Video not found");
  }
    return res.status(200)
    .json(new Apiresponse(200,video,"video deleted successfully"))
})
const togglePublishStatus =asyncHandler(async(req,res)=>{
    //--logic for toggle publish status--
    //get videoId from req.params
    //find the video by id
    //check validation 
    //toggle the publish status
    //return response with apiresponse
    const {videoId}=req.params
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiErrors(404,"Video not found")
    }
    video.isPublished = !video.isPublished;
    await video.save();
    return res.status(200)
    .json(new Apiresponse(200,video,"Video publish status toggled successfully"))
})
export{
    getAllvideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}