const nodemailer = require("nodemailer");
const {PASSWORD,EMAIL }=require("../config/env.config")

const smtpServer=async(toEmail,otp)=>{
    const transport=nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:EMAIL,
            pass:PASSWORD, 
        }
    })

    const mailOption={
        from:EMAIL,
        to:toEmail,
        subject:"OTP Verification-athlinc",
        html:`<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Dear User,</p>
          <p>Your OTP to verify your account is:</p>
          <p style="font-size: 1.5em; color: #007bff; font-weight: bold;">${otp}</p>
          <p>Please enter this code to complete your verification process. This code is valid for the next 60 seconds.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 0.9em; color: #888;">This is an automated message, please do not reply.</p>
        </div>
        `,
    }

    try {
        await transport.sendMail(mailOption)
        transport.close()
        return true
    } catch (error) {
        return false
    }
}

module.exports={
    smtpServer
}