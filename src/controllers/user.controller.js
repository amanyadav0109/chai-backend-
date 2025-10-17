import {asyncHandler} from "../utilis/asyncHandler.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import {uploadOncloudinary} from "../utilis/Cloudinary.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt;

const generateAccessandRefreshTokens=async(userId)=>{
  try {
    const user =await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
 
    //save refreshtoken in database
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    
    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiErrors("something went wrong while generating refresh and access token",500);
  }
}
const registerUser = asyncHandler(async (req, res) => {

  //---logic for registering user--

  //1-get user details from frontend
  //2-validation
  //3-check if user already exists :username or email
  //4-check for image & avtar
  //5-upload image to cloudinary
  //6-create user object - entry in db
  //7-remove password  & refresh token field from response
  //8-check for user created or not
  //9-return response

  //1-get user details from frontend
  const {fullName, email, username, password} = req.body;
 
  //validation
  
  if (
    [fullName,email,username,password].some((field) =>!field?.trim())
  ) {
    throw new ApiErrors("All fields are required", 400);
  }

  //check if user already exists

  const existesUser = await User.findOne({
    $or: [{username}, {email}],
  });
  if (existesUser) {
    throw new ApiErrors("User with email or username already exists", 409);
  }

  // Check for avatar & cover image
  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
  }
  if (!avatarLocalPath) {
    throw new ApiErrors(400,"Avatar file is required");
  }
  //upload image to cloudinary
  
  const avatar = await uploadOncloudinary(avatarLocalPath);
  const coverImage = await uploadOncloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiErrors("Avatar upload failed, please try again", 400);
  }
  
  //create user object - entry in db
 
  const user = await User.create({
    fullName,
     email,
    username: username.toLowerCase(),
    password,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
   
  });
  // remove password  & refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //check for user created or not
  if (!createdUser) {
    throw new ApiErrors("Failed to create user", 500);
  }
  //return response
  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "User register successfully"));
});

const loginUser=asyncHandler(async(req,res)=>{
  //req.body->data
  //validation through username or email
  //find the user
  //password check
  //accesstoken & refresh token
  //send cookie

  const {username,email,password}=req.body;
   //(!(username || email)) aagar ek ek karke check karna ho toh
  if(!(username || email)){
    throw new ApiErrors("Username or email is required",400);
  }
  const user = await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiErrors("User not found",404);
  }
   const isPasswordvalid=await user.ispasswordCorrect(password)
    if(!isPasswordvalid){
      throw new ApiErrors("password incorrect",401);
    }
    const {accessToken,refreshToken}=await
     generateAccessandRefreshTokens(user._id)
    
     // Check if accessToken exists
if (!accessToken || !refreshToken) {
    throw new ApiErrors(500, "Token generation failed");
}

     const loggedInUser= await User.findById(user._id).
     select("-password -refreshToken")

    //send cookie
    
    const option={
      httpOnly:true,
      secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
      new Apiresponse( 200,
        {
          user:loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
  //find user
  //remove refreshtoken from db
  //remove cookies
  //send response
  
 
  //  Remove refreshToken from DB (if it exists)
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset:{
          refreshToken: 1 // this removes the field from document
        }
      },{
        new :true
      }
      
    )
    //  Cookie options
    const option={
      httpOnly:true,
      secure:true,
    }
    // Clear cookies and send response
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json({
       statuscode: 200,
       message: "User logged out successfully",
       success: true,
       data: null
   });
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
     
   if (!incomingRefreshToken){
          throw new ApiErrors(401,"unauthorized request")
    }
   try {
     const decodedToken =  jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     )
     const user=await User.findById(decodedToken?._id)
     if (!user){
       throw new ApiErrors(401,"invalid refresh token")
     }
     if(incomingRefreshToken!==user?.refreshToken){
       throw new ApiErrors(401,"refresh token is error")
     }
     const options={
       httpOnly:true,
       secure:true
     }
    const {accessToken,newrefreshToken}=await generateAccessandRefreshTokens(user._id)
   return res 
   .status(200)
   .cookies("accessToken", accessToken,options)
   .cookies("refreshToken", newrefreshToken,options)
   .json(
     new Apiresponse(
       200,
       {accessToken, newrefreshToken},
       "Access token refreshed successfully"
     )
   )
  
   } catch (error) {
    throw new ApiErrors(401,error?.message || 
      "inavlid refresh token")
   }
  })
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    //get user from req
    //get old password & new password from req.body
    //validation
    //find user from db
    //old password check
    //update password
    //save user
    //send response 
    const {oldPassword,newPassword}=req.body
    const user= await User.findById(req.user._id)
    const ispasswordCorrect=await user.ispasswordCorrect(oldPassword)
    if(!ispasswordCorrect){
      throw new ApiErrors("old password is incorrect",400)
    }
    user.password=newPassword
     await user.save({validateBeforeSave:false})
     return res
     .status(200)
     .json(
      new Apiresponse(
        200,
        {},
        "Password changed successfully"
      )
     )
  })
const getcurrentuser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        req.user,
        "Current user fetched successfully"
      )
    )
  })
const updateAccountDetail=asyncHandler(async(req,res)=>{
  const{fullName,email}=req.body
  if(!fullName || !email){
    throw new ApiErrors(400,"fullName & email required")
  }
  const user=await User.findByIdAndUpdate(
    req.user._id,
    {$set:{
      fullName,
      email}
    },
    {new:true}
  ).select("-password ")
  return res 
  .status(200)
  .json(
    new Apiresponse(
      200,
      user,
      "Account details updated successfully"
    )
  )
})
const updateuserAvatar=asyncHandler(async(req,res)=>{
   const avatarlocalpath=req.file?.path
   if(!avatarlocalpath){
    throw new ApiErrors(400,"avatar file is missing")
   }
    const avatar=await uploadOncloudinary(avatarlocalpath)
    if(!avatar?.url){
      throw new ApiErrors(400,"error while uploading avatar")
    }
   const user= await User.findByIdAndUpdate(
      req.user?._id,
      {$set:{
        avatar:avatar.url
      }},
      {new:true}
    ).select("-password")
    return res 
  .status(200)
  .json(
    new Apiresponse(
      200,
     user,
      "avatar updated successfully"
    )
  )

})
const updateusercoverImage=asyncHandler(async(req,res)=>{
 const coverImagelocalpath=req.file?.path
 if(!coverImagelocalpath){
  throw new ApiErrors(400,"coverImage file is missing")
 }
  const coverImage=await uploadOncloudinary(coverImagelocalpath)
  if(!coverImage.url){
    throw new ApiErrors(400,"error while uploading cover image")
  }
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {$set:{
      coverImage:coverImage.url
    }},
    {new:true}
  ).select("-password")
  return res 
  .status(200)
  .json(
    new Apiresponse(
      200,
     user,
      "coverImage updated successfully"
    )
  )
})
const getuserChannelProfile=asyncHandler(async(req,res)=>{
  const {username}=req.params
  if (!username?.trim()) {
    throw new ApiErrors(400,"username is missing");
    
  }
  const channel= await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }
     },
     {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
     },
     {
      $lookup:{
         from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
     },
     {
     $addFields:{
      subscribersCount:{
         $size:"$subscribers"
      },
      channelssubscribersTocount:{
        $size:"$subscribedTo"
      },
      isSubscribed:{
        $cond:{
          if:{$in:[req.User?._id,"$subscribers.subscriber"]},
          then:true,
          else:false
        }
      }
     }
     },
     {
      $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        channelssubscribersTocount:1,
        isSubscribed:1,
        email:1,
        avatar:1,
        coverImage:1
      }
     }
   
])
if (!channel?.length) {
  throw new ApiErrors(400,"channel does not exits");
  
}
return res
.status(200)
.json(
  new Apiresponse(
    200,
    channel[0],
    "User channel fetched successfully"
  )
)
})

export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getcurrentuser,
  updateAccountDetail,
  updateuserAvatar,
  updateusercoverImage,
  getuserChannelProfile
};