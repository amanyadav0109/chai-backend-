import mongoose from "mongoose"
import {User} from "../models/user.models.js";
import {Comment} from "../models/comment.models.js"
import ApiErrors from "../utilis/ApiErrors.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
     // Convert to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    // Skip formula
    const skip = (pageNumber - 1) * limitNumber;
    const comments=await Comment.find({video:videoId})
    .populate('owner', 'avatar name')
    .sort({ createdAt: -1 })   // latest comment first
    .skip(skip)
    .limit(limitNumber);
     const totalComments= await Comment.countDocuments({video:videoId});
       return res.status(200).json(
        new Apiresponse(200, 
            {
                comments,
                totalComments,
                page: pageNumber,
                totalPages: Math.ceil(totalComments / limitNumber)
            },
            "Video comments fetched successfully"
        )
    );
    })
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const userId=req.body.userId
    const{videoId,text}=req.body
     if(!videoId || !text){
            throw new ApiErrors(400,"text & videoId are required")
        }
        const newcomment=await Comment.create({
            content:text,
            video:videoId,
            owner:userId

        })
         return res.status(200)
    .json(new Apiresponse(200,newcomment,"comment added  successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const{commentId,text }=req.body
     if(!commentId || !text){
            throw new ApiErrors(400,"  commedId are required")
        }
        const updatecomment=await Comment.findByIdAndUpdate(commentId,
            {
                $set:{content:text}
            },{new:true}
        )
          if(!updatecomment){
        throw new ApiErrors(400,"updatecomment is required")
    }
         return res.status(200)
   .json(new Apiresponse(200,updatecomment," update comment successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const{commentId}=req.body
     if(!commentId){
            throw new ApiErrors(400,"  commedId are required")
        }
        const deletecomment=await Comment.findByIdAndDelete(commentId,)
         return res.status(200)
   .json(new Apiresponse(200,deletecomment," delete comment successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }