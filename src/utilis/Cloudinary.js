import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
// import 'dotenv/config';// Ensure environment variables are loaded
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(), 
  api_key: process.env.CLOUDINARY_API_KEY.trim(), 
  api_secret: process.env.CLOUDINARY_API_SECRET.trim() 
});
const uploadOncloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) {      
            return null;
        }
        //upload the file on cloudinary
    
       const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            })
            //file has been upload successfully          
          //console.log("file has been upload successfully",response.url);
           fs.unlinkSync(localFilePath) 
            return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload operation  got faild  
    return null;
    }
}      
// In your Cloudinary utility file
export {uploadOncloudinary}