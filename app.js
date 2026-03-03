import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"
import router from "./router/user.router.js"

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: false, limit: "10kb" }))

app.use(express.static("public"))

app.use(cookieParser())   // ✅ FIXED

app.use("/api", router)

export default app