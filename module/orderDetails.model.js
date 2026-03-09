import mongoose from "mongoose"



const orderDetails = new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    orderName:{
        type:String,
        required:true
    },
    orderLocation:{
        type:String,
        required:true
    },
    orderDateAndTime:{
        type:String,
        required:true
    },
    orderStatus:{
        type:String,
        enum:["pending" , "success" , "onProccess"],
        default:"onProccess",
        required:true

    },
    orderImage:{
        type:String,
        required:true
    }
})

export const orderDetailsset = mongoose.model("orderDetails" , orderDetails)