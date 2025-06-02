const userRoute=require("express").Router()
const {fillUserDetails,getUserDetails, updateUserDetails }=require("../controller/userDetail.controller")
const { authenticated}=require("../middleware/auth.middleware")


userRoute.post("/user-detail",authenticated,fillUserDetails)
userRoute.get("/user-detail",authenticated,getUserDetails)
userRoute.put("/update-user",authenticated,updateUserDetails)

module.exports=userRoute