import { User } from "../module/User.module.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyUser = asyncHandler(async(req , res , next) => {
   try {
     const token = req.cookies?.accesstoken
     if(!token){
         return res.status(401).json({
             success:false,
             message:"unauthorized"
         })
     }
     const decodedtoken = await jwt.verify(token , process.env.JWT_ACCESS_TOKEN)
     const user = await User.findById(decodedtoken._id)
     if(!user){
         return res.status(400).json({
             success:false,
             message:"invalied credentials"
         })
     }
     req.user = user
     next()
   } catch (error) {
    throw new Error("invlid creadentials")
    
   }
})