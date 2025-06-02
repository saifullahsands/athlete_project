const prisma = require("../lib/prismaClient");
const { okResponse, smtpServer, generateOtp,HashingPassword,generateToken,ComparePassword } = require("../utils/index");

//SIGNUP
const registerUser = async (req, res, next) => {
    try {
        const { email} = req.body;
        const checkingEmail = await prisma.user.findUnique({
            where: { email }
        })
        if (checkingEmail) {
            throw new Error("user is already exist")
        }
        const otp = generateOtp()
        await smtpServer(email, otp)
        const expireTime = new Date(Date.now() + 5 * 60 * 1000) //10 min
        const dbOtp = await prisma.otp.create({
            data: {
                email,
                code: otp,
                expireAt: expireTime,
                otp_type: "SIGNUP_VERIFICATION"
            }
        })
        okResponse(res, 201, "otp send your email ", dbOtp.code)
    } catch (error) {
        console.log("error in register user", error.message)
        next(error)
    }
}
 
//SIGNUP_VERIFICATION
//RESET_PASSWORD
const resendOtp = async (req, res, next) => {
    try {
        const { email, type } = req.body;
        const otp = generateOtp()
        await smtpServer(email, otp)
        const expireTime = new Date(Date.now() + 5 * 60 * 1000)


        const resendOtpForVerification = await prisma.otp.create({
            data: {
                email,
                code: otp,
                expireAt: expireTime,
                otp_type: type
            }
        })
        const message = type === "SIGNUP_VERIFICATION" ? "resend otp for verification" : "resend otp for forget password"
        okResponse(res, 200, message, resendOtpForVerification.code)
    }
    catch (error) {
        next(error);
    }
}


const verifyOtp = async (req, res, next) => {
    try {
        const { email, password, otp ,role} = req.body;
        const verifyOtp = await prisma.otp.findFirst({
            where: {
                email,
                code: parseInt(otp)
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const hashPassword=await HashingPassword(password)
        if (!verifyOtp) {
            throw new Error("Invalid otp")
        }
        if (Date.now() > new Date(verifyOtp.expireAt).getTime()) {
            throw new Error("Otp is expired")
        }
        if (verifyOtp.otp_type === "SIGNUP_VERIFICATION") {
            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (!existingUser) {
                const user=await prisma.user.create({
                    data: {
                        email,
                        password: hashPassword,
                        role,
                        isVerified: true
                    }
                })
                delete user.password
                const token=await generateToken(user.id)
                okResponse(res,200,"user is verified successfully",user,token)
            }
            else if (!existingUser.isVerified) {
              const user=  await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        isVerified: true
                    }
                })
                delete user.password
                const token=await generateToken(user.id)
                okResponse(res,200,"user is verified successfully",user,token)
            }

        }
        else {
            throw new Error("user is already veirfied")
        }
        
    } catch (error) {
        console.log("error in  verify otp  ", error.message)
        next(error)
    }
}

const CreateNewPassword = async (req, res, next) => {
    try {
        const { email, newPassword, otp } = req.body;
        let user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            throw new Error('user is not exist')
        }

        const existingOtp = await prisma.otp.findFirst({
            where: {
                email,
                code: parseInt(otp)
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (Date.now() > new Date(existingOtp.expireAt).getTime()) {
            throw new Error("otp is expired")
        }
        const updateUserPassword = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword
            }
        })
        okResponse(res, 200, "changed password successfully", updateUserPassword)
    } catch (error) {
        console.log(`error in create new Password :: ${error.message}`)
        next(error)
    }
}

const login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        let user=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            throw new Error("user is not exist")
        }
        const matchedPassword=await ComparePassword(password,user.password)
        if(!matchedPassword){
            throw new Error("invalid credientials")
        }
        const token = await generateToken(user.id)
        delete user.password
        okResponse(res,200,"user Logged in successfully ",user,token)
    } catch (error) {
        console.log("error in login :: ",error.message)
        next(error)
    }
}
module.exports = {
    registerUser,
    resendOtp,
    verifyOtp,
    CreateNewPassword,
    login
}