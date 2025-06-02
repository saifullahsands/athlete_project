
// const  prisma=require("../lib/prismaClient")
const { generateOtp } = require("../utils/generateOtp")
const { smtpServer } = require("../utils/sendEmail")
const prisma = require("../lib/prismaClient")
const { okResponse } = require("../utils/handleError")

//SIGNUP
const registerUser = async (req, res, next) => {
    try {
        const { email } = req.body;
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
        const { email,password, otp } = req.body;
        const verifyOtp = await prisma.otp.findFirst({
            where: {
                email,
                code:parseInt(otp)
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if (!verifyOtp) {
            throw new Error("Invalid otp")
        }
        if (Date.now() > new Date(verifyOtp.expireAt).getTime()) {
            throw new Error("Otp is expired")
        }
        if (verifyOtp.otp_type === "SIGNUP_VERIFICATION") {
            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        email,
                        password: password,
                        role: "ATHELETE",
                        isVerified: true
                    }
                })
            }
            else if (!existingUser.isVerified) {
                await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        isVerified: true
                    }
                })
            }
        }
        else {
            throw new Error("user is already veirfied")
        }
        okResponse(res, 200, "otp is verified", null)
    } catch (error) {
        console.log("error in  verify otp  ", error.message)
        next(error)
    }
}


module.exports = {
   registerUser,
   resendOtp,
   verifyOtp
}