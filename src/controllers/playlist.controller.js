import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
import { PlayList } from "../models/playlist.models.js";
const createPlaylist=asyncHandler(async(req,res)=>{
    const{name,description}=req.body
})
const getUserPlaylists=asyncHandler(async(req,res)=>{
    const{userId}=req.params
})
const getPlaylistById=asyncHandler(async(req,res)=>{
    const{playlistId}=req.params
})
const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const{playlistId,videoId}=req.params
})
const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const{playlistId,videoId}=req.params
})
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
})
export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}