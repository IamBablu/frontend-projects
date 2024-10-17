import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
        api_key : process.env.CLOUDINARY_API_KEY, 
        api_secret : process.env.CLOUDINARY_API_SECRET
    })

    //Upload on cloudinary
    const uploadCloudinary = async (localpath)=>{
        try {
            if(!localpath) return null
        //upload the file cloudinary
        const response = await cloudinary.uploader.upload(localpath , {
            resource_type: 'auto'
        })
        //This file has been uploaded successfully
        // console.log("File is uploaded on cloudinary ",response.url)
        fs.unlinkSync(localpath);
        return response
        } catch (error) {
            fs.unlinkSync(localpath)//Remove the locally saved temporary file as the uploaded operation got fail
            return null
        }
    } 

    export {uploadCloudinary}