const {ConnectDatabase }=require("./config/db.config")
const { PORT } = require("./config/env.config")
const app=require("./app")
const prisma=require("./lib/prismaClient");

(async ()=>{
    try {
          await  ConnectDatabase()
          app.listen(PORT,()=>console.log(`server is running on PORT : ${PORT}`))
    } catch (error) {
        console.log(`error in server connection with database :: ${error.message}`)
        await prisma.$disconnect()
        process.exit(1)
    }
 
})()