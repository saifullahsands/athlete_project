const JWT=require("jsonwebtoken");
const prisma=require("../lib/prismaClient")
const {TOKEN_SECRET_KEY}=require("../config/env.config")



const authenticated=async(req,res,next)=>{
    try {
        const authHeader=req.headers["authorization"]
        if(!req.headers || !authHeader.startsWith("Bearer ")){
            throw new Error("token is not found or malformed")
        }

        const token=authHeader.replace("Bearer ","")
        const decoded=JWT.verify(token,TOKEN_SECRET_KEY);
        const user =await prisma.user.findUnique({
            where:{
                id:parseInt(decoded.id)
            }
        })

        if(!user){
            throw new Error("unAuthorized ")
        }
        delete user.password
        req.user=user
        next()
    } catch (error) {
        console.log("error in auth middleware :: ",error.message)
        next(error)
    }
}

const verifyRole=(role)=>{
    try {
        return (req,res,next)=>{
            if(!req.user || req.user.role !== role){
                throw new Error(`only this ${role} can access it `)
            }
            next()
        }
    } catch (error) {
        console.log(`error in role verification ::  ${error.message}`)
        next(error)
    }
}

module.exports={
    verifyRole,
    authenticated
}