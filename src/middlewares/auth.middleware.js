import { asyncHandler } from "../utilis/asyncHandler.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt;
import ApiErrors from "../utilis/ApiErrors.js";
import { User } from "../models/user.models.js";

export const verifyJWT=asyncHandler(async(req, _,next)=>{
    //get token from headers
   try {
   
       const token = 
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer ", "") 

  
    
    if (!token) {
      
      throw new ApiErrors(401, "Unauthorized request");
    }
     //verify token
     const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user= await User.findById(decodedToken?._id).
     select("-password -refreshToken")
     if(!user){
         throw new ApiErrors(401,"Invalid Access Token");
     }
     req.user=user;
     next()
   } catch (error) {
     // 👇 If token expired or invalid during logout — just continue
   
    throw new ApiErrors(401, error?.message || "Invalid access token")
   }
})
