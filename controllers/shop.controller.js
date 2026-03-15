import { asyncHandler } from "../utils/asyncHandler.js";
import { Shopdata } from "../module/shop.model.js";
import { orderDetailsset } from "../module/orderDetails.model.js";

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

export const orderDetailsdata = asyncHandler(async(req , res) => {
    const {orderId} = req.body

    const findshop = await Shopdata.findById((orderId))
    if(!findshop){
        return res.status(401).json({
            success:false,
            message:"shop was not found"
        })
    }
    console.log(findshop)
    const createorder = await orderDetailsset.create({
        orderId:findshop._id,
        orderName:findshop.shopName,
        orderLocation:findshop.location,
        orderImage:findshop.shopImage

    })
    console.log(createorder)

})

export const getorderdetails = asyncHandler(async(req , res) => {
    const {_id} = req.params
    console.log("skdfnskf",_id)
    const orderId = _id

    const findorderdata = await orderDetailsset.findOne({orderId})
    if(!findorderdata){
        return res.status(401).json({
            success:false,
            message:"order data not found"
        })
    }
    console.log(findorderdata)

    return res.status(201).json({
        success:false,
        message:"find successfully",
        findorderdata
    })

})

export const ordersget = asyncHandler(async(req , res) => {2
  
    const findshops = await orderDetailsset.find({})
    if(!findshops){
        return res.status(401).json({
            success:false,
            message:"Data not found"
        })
    }


    return res.status(201).json({
        success:true,
        message:"data recisived",
        findshops
    })

})

export const orderPermission = asyncHandler(async(req , res) => {
    const {orderId , permission} = req.body
    console.log(orderId , permission)

    

    const findshops = await orderDetailsset.findById({_id:orderId})
    console.log(findshops)
    if(!findshops){
        return res.status(401).json({
            success:false,
            message:"Data not found"
        })
    }

    if(permission === "yes"){
        findshops.orderStatus = "success"
        await findshops.save()
    }
    else{
        findshops.orderStatus = "pending"
        await findshops.save()
    }
    console.log(findshops)

})
 