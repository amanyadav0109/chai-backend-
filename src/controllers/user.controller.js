import  {asyncHandler} from '../utilis/asyncHandler.js';
import   ApiErrors from '../utilis/ApiErrors.js';
import User from '../models/user.models.js';
import {Apiresponse} from '../utilis/ApiResponse.js';
import { uploadOncloudinary } from '../utilis/Cloudinary.js';
const registerUser=asyncHandler(async(req,res)=>{
   //logic for registering user

   //1-get user details from frontend
   //validation
   //check if user already exists :username or email
   //check for image & avtar
   //upload image to cloudinary
   //create user object - entry in db
   // remove password  & refresh token field from response
    //check for user created or not
   //return response


        const {fullName,email,username,password}= req.body
        console.log("email:",email);
       
        //validation
        if(
            [fullName,email,username,password].some((field)=>
                field ?.trim()==="")
        ){
            throw new ApiErrors("All fields are required",400)
        }
       
        //check if user already exists
         const existesUser=User.findOne({
            $or: [{ username  },{ email }]
        })
        if(existesUser){
            throw new ApiErrors("User already exists",409)                                              
        }
        //check for image & avtar
         const avatarLoalPath=req.files?.avatar[0]?.path;
         const coverImageLoalPath=req.files?.coverImage[0]?.path;
         if(!avatarLoalPath){
            throw new ApiErrors("Avtar is required",400)
         }
         //upload image to cloudinary
        const avatar= await uploadOncloudinary(avatarLoalPath)
        const coverImage= await uploadOncloudinary(coverImageLoalPath)
        if(!avatar){
            throw new ApiErrors("Avtar file is required",400)

        }
        //create user object - entry in db
       const user=await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url ||"",
            email,
            username:username.toLowerCase(),
            password,
        })
        // remove password  & refresh token field from response
        const createdUser=await user.findById(user._id).select(
            "-password -refreshToken"
        )
        //check for user created or not
        if(!createdUser){
            throw new ApiErrors("Failed to create user",500)
        }
        //return response
        return res.status(201).json(
            new Apiresponse(200,createdUser,"User register successfully")
        )

})
export {registerUser};