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

})
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }