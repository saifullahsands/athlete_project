const athleteRoute = require("./athelete/athleteRoute")
const authRouter = require("./authRouter")
const coachRoute = require("./coach/coachRoute")

const rootRouter=require("express").Router()

rootRouter.use("/auth",authRouter)

rootRouter.use("/athlete",athleteRoute)
rootRouter.use("/coach",coachRoute)
rootRouter.all("*",(req,res,next)=>{
    return res.status(400).json({message:"this route cannot accessable"})
})

module.exports=rootRouter