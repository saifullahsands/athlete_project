
const prisma=require("../lib/prismaClient");

const ConnectDatabase=async()=>{
    try {
        await prisma.$connect()
        console.log(`database connected successfully`)
    } catch (error) {
        console.log(`error in connection database :: ${error.message}`)
        await prisma.$disconnect()
        process.exit(1)
    }
}

module.exports={
    ConnectDatabase
}