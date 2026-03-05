import { asyncHandler } from "../utils/asyncHandler.js";
import { Shopdata } from "../module/shop.model.js";

export const shopdatashow = asyncHandler(async (req, res) => {

    const { shopcat, location } = req.body

    const finddata = await Shopdata.find({
        shopName: { $regex: shopcat, $options: "i" },
        location: { $regex: location, $options: "i" }
    })

    if (finddata.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No shops found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Shop found",
        data: finddata
    })

})

export const shopfulldetails = asyncHandler(async(req , res) => {
    const {_id} = req.params

    const finddata = await Shopdata.findById({_id})
    if(!finddata){
        return res.status(401).json({
            success:false,
            message:"data not found"
        })
    }
    return res.status(201).json({
        success:true,
        message:"data founded",
        finddata
    })
})