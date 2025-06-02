const authRouter = require("./authRouter")
const rootRouter=require("express").Router()

rootRouter.use("/auth",authRouter)

rootRouter.all("*",(req,res,next)=>{
    return res.status(400).json({message:"this route cannot accessable"})
})

module.exports=rootRouter