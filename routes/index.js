const authRouter = require("./authRouter")
const userRoute = require("./userRoute")
const rootRouter=require("express").Router()

rootRouter.use("/auth",authRouter)
rootRouter.use("/user",userRoute)
rootRouter.all("*",(req,res,next)=>{
    return res.status(400).json({message:"this route cannot accessable"})
})

module.exports=rootRouter