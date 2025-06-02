const authRouter = require("express").Router()
const authController = require("../controller/auth.controller")


authRouter.post("/register", authController.registerUser);
authRouter.patch("/verify-otp", authController.verifyOtp)
authRouter.patch("/resend-otp", authController.resendOtp);
authRouter.patch("/new-password", authController.CreateNewPassword);
authRouter.post("/login", authController.login);

module.exports = authRouter