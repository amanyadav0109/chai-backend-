
import {loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getcurrentuser, getwatchHistory, updateAccountDetail, updateuserAvatar, updateusercoverImage, getuserChannelProfile} from '../controllers/user.controller.js'
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router=Router();
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser)
//secure routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getcurrentuser)
router.route("/update-account").patch(verifyJWT,updateAccountDetail)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateuserAvatar)
router.route("/cover-Image").patch(verifyJWT,upload.single("/coverImage"),updateusercoverImage)
router.route("/c/:username").get(verifyJWT,getuserChannelProfile)
router.route("/watch-history").get(verifyJWT,getwatchHistory)
export default router;