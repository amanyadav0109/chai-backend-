import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
cloudinary.config({ 
  cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
  api_key: 'process.env.CLOUDINARY_API_KEY', 
  api_secret: 'process.env.CLOUDINARY_API_SECRET'
});
const uploadOncloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload tyhe file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"

            })
            //file has been upload successfully
            console.log("file has been upload successfully",response.url);
             return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload operation  got faild
       return null;
        
    }
}
export {uploadOncloudinary};