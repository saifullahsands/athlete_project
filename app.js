const express=require("express")
const app=express()
const reqResInspector = require("express-req-res-inspector");
const {PORT }=require("./config/env.config");
const  globalMiddleware = require("./middleware/globalMiddleware");
const rootRouter = require("./routes");
app.use(express.json({
    limit:"90mb"
}))
app.use(reqResInspector())
app.get("/health-check",(req,res,next)=>{
    return res.status(200).json({
        success:true,
        message:"server is up and running"
    })
})

app.use("/api/v1",rootRouter)
app.use(globalMiddleware)



module.exports=app