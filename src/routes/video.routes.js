import { getAllvideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controller.js"
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router=Router();
router.use(verifyJWT);
router.route("/")
.get(getAllvideos)
.post(
    upload.fields([
        {
            name:"videofile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishAVideo
);
router.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("thumbnail"),updateVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router