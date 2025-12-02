import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
      createPlaylist,
    getUserPlaylists,
   addVideoToPlaylist,
     getPlaylistById,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
const router=Router()
router.use(verifyJWT)
router.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playListId").patch(removeVideoFromPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/").post(createPlaylist)
export default router
