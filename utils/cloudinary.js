import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name:'dvogl4c7a',
        api_key:'248329574647344',
        api_secret:'2iCtnC6yiNpPDIu3QEKEqcHSvw8'
    
})

const uploadCloudinary = async(localFilePath) => {
    try {
        const res = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })
        console.log("file uploaded successfully" , res.url)
        return res
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
        
    }
}
export default uploadCloudinary