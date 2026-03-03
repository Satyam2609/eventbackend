import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../module/User.module.js";
import uploadCloudinary from "../utils/cloudinary.js";


const generateAccesstokenAndRefreshtoken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accesstoken = user.generateAccesstoken()
        const refreshtoken = user.generateRefreshtoken()
        user.refreshtoken = refreshtoken
        await user.save({validateBeforeSave:false})
        return {accesstoken ,refreshtoken}
    } catch (error) {
        throw new Error("not generated")
    }

}

export const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if ([username, email, password].some(f => !f || f.trim() === "")) {
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    // ✅ IMPORTANT FIX
    if (!req.file) {
        return res.status(400).json({
            success:false,
            message:"Avatar image is required"
        })
    }

    const uploadimage = await uploadCloudinary(req.file.path)

    if (!uploadimage) {
        return res.status(401).json({
            success:false,
            message:"url not found"
        })
    }

    const existuser = await User.findOne({ email })

    if (existuser) {
        return res.status(400).json({
            success:false,
            message:"user already exist"
        })
    }

    await User.create({
        username,
        email,
        password,
        avatar: uploadimage.url
    })

    return res.status(201).json({
        success:true,
        message:"Register successfully"
    })
})

export const loginuser = asyncHandler(async(req , res) => {
    const {email , password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All feilds are required"
        })
    }
    const existuser = await User.findOne({email})
    if(!existuser){
        return res.status(401).json({
            success:false,
            message:"user not exsist"
        })
    }
    const ispassword = await existuser.isPasswordCorrect(password)
    if(!ispassword){
        return res.status(401).json({
            success:false,
            message:"Incorrect password"
        })
        
    }
    const {accesstoken , refreshtoken} = await generateAccesstokenAndRefreshtoken(existuser._id)

    const option = {
        httpOnly:true,
        secure:true
    }

     return res.status(200)
    .cookie("accesstoken" , accesstoken , option)
    .cookie("refreshtoken" , refreshtoken , option)
    .json({
        success:true,
        message:"Loggin Successfully"
    })
})

export const logout = asyncHandler(async(req , res) => {
  if(!req.user){
    return res.status(401).json({
      success:false,
      message:"unthorized"
    })
  }

  await User.findByIdAndUpdate(req.user._id , {
    $set:{
      refreshtoken:null,
      isActive:false
    }
  },
  {new:true}
)

const option = {
  httpOnly: true,
  secure: true,
  sameSite: "none"
}

return res.status(200)
.clearCookie("accesstoken" , option)
.clearCookie("refreshtoken" , option)
.json({
  success:true,
  message:"Logout successfully"
})
})
