import { Router } from "express";
import {
        getVideoComments,
        addComment, 
        updateComment,
        deleteComment
    } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoComments } from "../controllers/commentent.controller.js";
const router=Router();
router.use(verifyJWT);
router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:commentId").get(deleteComment).post(updateComment)
export default router;