import { asyncHandler } from "../utils/asyncHandler.js";
import { Shopdata } from "../module/shop.model.js";

export const shopdatashow = asyncHandler(async(req , res) => {
    const {shopcat , location} = req.body
    console.log(shopcat)

    const finddata = await Shopdata.find({shopName:shopcat})
    if(!finddata){
        return res.status(401).json({
            success:false,
            message:"shopcat in needed"
        })
    }
    console.log(finddata)

    const findlocation = finddata.includes(location)
    if(!findlocation){
        return res.status(401).json({
            success:false,
            message:"shopcat in needed"
        })
    }

    return res.status(201).json({
        success:true,
        message:"shop finds",
        findlocation
    })
    
    
})