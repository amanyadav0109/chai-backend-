import { Video } from "../models/video.models";
import {User} from "../models/user.models";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOncloudinary} from "../utilis/Cloudinary.js";
const getAllvideos=asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId }=req.body
})
const publishAVideo =asyncHandler(async(req,res)=>{
    const{tittle,description}=req.body
})
const getVideoById=asyncHandler(async(req,res)=>{
    const{videoId}=req.body
})
const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.body
})
const deleteVideo =asyncHandler(async(req,res)=>{
    const {videoId}=req.body
})
const togglePublishStatus =asyncHandler(async(req,res)=>{
    const {videoId}=req.params
})
export{
    getAllvideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}