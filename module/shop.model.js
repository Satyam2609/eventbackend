import mongoose from "mongoose"

const shopData = new mongoose.Schema({
    shopImage:{
        type:String,
        required:true
    },
    shopName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    cartsreq:[
        {
            type:String,
            required:true
        }
    ],
    services:[
        {type:String,
            required:true
        }
    ],
    shopGallery:[
        {type:String,required:true}
    ],
price:[
    {min:String , max:String}
]
})
export const Shopdata = mongoose.model("Shopdata" , shopData)