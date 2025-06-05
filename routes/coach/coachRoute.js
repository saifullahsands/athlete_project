const { CoachDetails } = require("../../controller/coach/coachDetail.controller")
const { authenticated, verifyRole } = require("../../middleware/auth.middleware")
const { validateSchema } = require("../../middleware/validate.middleware")
const CoachvalidateSchema=require("../../validations/coachValidition")
const upload=require("../../middleware/multer.middleware")
const coachRoute=require("express").Router()

coachRoute.post("/detail",authenticated,verifyRole("COACH"),upload.fields([{name:"profileImage" , maxCount:1},{name:"certificateImage"}]),validateSchema(CoachvalidateSchema),CoachDetails)

module.exports=coachRoute