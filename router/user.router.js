import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { getorderdetails, orderDetailsdata, shopdatashow, shopfulldetails } from "../controllers/shop.controller.js"

const router = Router()

router.route("/register").post(upload.single("avatar") ,  registerUser)
router.route("/getshop").post(shopdatashow)
router.route("/getshopdata/:_id").get(shopfulldetails)
router.route("/shopdataid").post(orderDetailsdata)
router.route("/getshoporder/:_id").get(getorderdetails)


export default router