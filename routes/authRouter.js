const authRouter=require("express").Router()
const authController=require("../controller/auth.controller")


authRouter.post("/register",authController.registerUser);
authRouter.post("/verify-otp",authController.verifyOtp)
authRouter.post("/resend-otp",authController.resendOtp);
module.exports=authRouter