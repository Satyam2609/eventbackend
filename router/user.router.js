import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { shopdatashow } from "../controllers/shop.controller.js"

const router = Router()

router.route("/register").post(upload.single("avatar") ,  registerUser)
router.route("/getshop").post(shopdatashow)

export default router