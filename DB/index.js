import mongoose from "mongoose"

const connectDB = async() => {
    try {
        const connectInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MONGODB Connected successfully ${connectInstance.connection.host}`)
        
    } catch (error) {
        console.log("MONGODB Connection Failed")
        process.exit(1)
        
    }
} 
export default connectDB