import { v2 as cloudinary} from 'cloudinary'
import fs, { lchownSync } from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        // upoload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file uploaded successfully
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (cloudinaryUrl, type) => {
    try {
        
        if(!cloudinaryUrl) return null;

        // Extract public ID from URL
        const urlParts = cloudinaryUrl.split('/');
        const publicIdWIthExtenstion = urlParts[urlParts.length - 1];
        const publicId = publicIdWIthExtenstion.split('.')[0];

        //Use cloudinary destroy method to delete the file
        const response = await cloudinary.uploader.destroy(publicId,{
            resource_type: type
        });
        return response

    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary}