import {asyncHandler} from "../utilis/asyncHandler.js";
import ApiErrors from "../utilis/ApiErrors.js";
import {User} from "../models/user.models.js";
import {Apiresponse} from "../utilis/ApiResponse.js";
import {uploadOncloudinary} from "../utilis/Cloudinary.js";
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
    [fullName, email, username, password].some((field) =>!field?.trim())
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
export { registerUser };