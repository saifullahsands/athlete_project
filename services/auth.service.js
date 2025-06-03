
const prisma=require("../lib/prismaClient")


const findOtp=async(email,otp)=>{
    return prisma.otp.findFirst({
        where:{
            email,
            code:parseInt(otp)
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}
const deleteOtp=async(id)=>{
    return prisma.otp.delete({
        where:{
            id
        }
    })
}
const createOtp=async({email,otp,otpType})=>{
    const expireTime=new Date(Date.now() + 5 * 60 *1000 )
    return prisma.otp.create({
        data:{
            email,
            code:otp,
            expireAt:expireTime,
            otp_type:otpType
        }
    })
}

const findUserByEmail=async(email)=>{
    return prisma.user.findUnique({
        where:{
            email
        }
    })
}

const createUser=async({email,password,role})=>{
    return prisma.user.create({
        data:{
            email,
            password,
            role,
            isVerified:true

        }
    })
}

const updateUserPassword=async(id,userPassword)=>{
    return prisma.user.update({
        where:{
            id
         },
        data:{
            password:userPassword
        }
    })
}

const findUserById=async(id)=>{
    return prisma.user.findUnique({
        where:{id:parseInt(id)}
    })
}



module.exports={
    createUser,
    findUserByEmail,
    findOtp,
    createOtp,
    updateUserPassword,
    deleteOtp,
    findUserById
}