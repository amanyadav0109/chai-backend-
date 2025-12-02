import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {asyncHandler} from "../utilis/asyncHandler.js";
import { PlayList } from "../models/playlist.models.js";
const createPlaylist=asyncHandler(async(req,res)=>{
    //userId fetch from req body
    //name and description from req.body
    //check validation name and desc
    //create playlist
    //return response
    const userId=req.user._id
    const{name,description}=req.body
    if(!name || !description){
        throw new ApiErrors(400,"name & description is required")
    }
    const newplaylist=await PlayList.create({
        name,
        description,
        owner:userId
    })
    return res.status(201)
    .json(new Apiresponse(201,newplaylist,"playlist create successfully"))
})
const getUserPlaylists=asyncHandler(async(req,res)=>{
    const{userId}=req.params
    const playlists=await PlayList.find({ owner: userId })
    return res.status(200)
    .json(new Apiresponse(200,playlists,"User playlists fetched successfully"))
})
const getPlaylistById=asyncHandler(async(req,res)=>{
    const{playlistId}=req.params
     const playlist=await PlayList.findById(playlistId)
      if (!playlist) {
        throw new ApiErrors(404, "PlaylistID not found");
    }
    return res.status(200)
    .json(new Apiresponse(200,playlist,"User by playlistId fetched successfully"))

})
const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const{playlistId,videoId}=req.params
    if(!playlistId || !videoId){
        throw new ApiErrors(400,"playlistId & videoId are required")
    }
    const playlist=await PlayList.findById(playlistId)
     if (!playlist) {
        throw new ApiErrors(404, "PlaylistID not found");
    }
    if(playlist.videos.includes(videoId)){
        throw new ApiErrors(400,"video already exists in playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return res.status(200)
    .json(new Apiresponse(200,playlist,"video added to playlist successfully"))
})
const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const{playlistId,videoId}=req.params
     if(!playlistId || !videoId){
        throw new ApiErrors(400,"playlistId & videoId are required")
    }
      const playlist=await PlayList.findById(playlistId)
     if (!playlist) {
        throw new ApiErrors(404, "PlaylistID not found");
    }
     // Check if video exists in playlist
     if(!playlist.videos.includes(videoId)){
        throw new ApiErrors(400,"Video does not exist in playlist")
    }
   // Remove the video using filter
   playlist.videos=playlist.videos.filter(
    (id)=>id.toString()!==videoId.toString()
   )
   await playlist.save()
   return res.status(200)
   .json(new Apiresponse(200,playlist,"video removed from playlist successfully"))
})
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist=await PlayList.findByIdAndDelete(playlistId)
    if(!playlist){
    
        throw new ApiErrors(400,"playlistId is required")
    }
    return res.status(200)
   .json(new Apiresponse(200,playlist," delete playlist successfully"))
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
     if(!name || !description){
        throw new ApiErrors(400,"name & description is required")
    }
    const playlist=await PlayList.findByIdAndUpdate(playlistId,
        {
            $set:{
                name,
                description
             }
        },{new:true}
    )
    if(!playlist){
        throw new ApiErrors(400,"playlistId is required")
    }
     return res.status(200)
   .json(new Apiresponse(200,playlist," update playlist successfully"))

  
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