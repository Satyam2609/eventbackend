import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:10
    },
    avatar:{
        type:String
    }

})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()
this.password = await bcrypt.hash(this.password , 10)
next()
} )
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccesstoken = function(){
   return jwt.sign({
_id:this._id,
username:this.username,
email:this.email
    },
process.env.JWT_ACCESS_TOKEN,
{expiresIn:"1d"})

}
userSchema.methods.generateRefreshtoken = function(){
    return jwt.sign({
        _id:this._id
    },
process.env.JWT_REFRESH_TOKEN,
{expiresIn:"7d"})
}
export const User = mongoose.model("user" , userSchema)