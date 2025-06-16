const authRouter = require("express").Router();
const authController = require("../controller/auth.controller");
const { getAllsport } = require("../controller/sport.controller");

const { authenticated } = require("../middleware/auth.middleware");

authRouter.post("/register", authController.registerUser);
authRouter.put("/verify-otp", authController.verifyOtp);
authRouter.put("/resend-otp", authController.resendOtp);
authRouter.put(
  "/send-otp-forget-password",
  authController.SendOtpforgetPassword
);
authRouter.put(
  "/verify-otp-forget-password",
  authController.verifyOtpAndsetNewPassword
);
authRouter.post("/login", authController.login);


authRouter.get("/get-sport",authenticated,getAllsport)
module.exports = authRouter;
