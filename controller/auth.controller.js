const prisma = require("../lib/prismaClient");
const { getAgeFromDob } = require("../utils/index");
const {
  okResponse,
  smtpServer,
  generateOtp,
  HashingPassword,
  generateToken,
  ComparePassword,
} = require("../utils/index");
const {
  findUserByEmail,
  createOtp,
  findOtp,
  updateUserPassword,
  deleteOtp,
  createUser,
  updateUserisVerified,
  getMyProfile,
} = require("../services/auth.service");
const { BadRequestError } = require("../utils/continous/handleError");
//SIGNUP
const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const checkingEmail = await findUserByEmail(email);
    if (checkingEmail) {
      return BadRequestError(res, "user is already exist");
    }
    const otp = generateOtp();
    await smtpServer(email, otp);
    const dbOtp = await createOtp({
      email,
      otp,
      otpType: "SIGNUP_VERIFICATION",
    });
    okResponse(res, 201, "otp send your email ", dbOtp.code);
  } catch (error) {
    console.log("error in register user", error.message);
    next(error);
  }
};

//SIGNUP_VERIFICATION
//RESET_PASSWORD
const resendOtp = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    const otp = generateOtp();
    await smtpServer(email, otp);

    const resendOtpForVerification = await createOtp({
      email,
      otp,
      otpType: type,
    });
    const message =
      type === "SIGNUP_VERIFICATION"
        ? "resend otp for verification"
        : "resend otp for forget password";
    okResponse(res, 200, message, resendOtpForVerification.code);
  } catch (error) {
    console.log(`error in resend otp`);
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, password, otp, role } = req.body;
    const verifyOtp = await findOtp(otp);

    const hashPassword = await HashingPassword(password);
    if (verifyOtp.email !== email) {
      return BadRequestError(res, "email is invalid");
    }
    if (!verifyOtp) {
      return BadRequestError(res, "otp is invalid or email is invalid");
    }
    if (Date.now() > new Date(verifyOtp.expireAt).getTime()) {
      await deleteOtp(verifyOtp.id);
      return BadRequestError(res, "Otp is expired");
    }
    if (verifyOtp.otp_type === "SIGNUP_VERIFICATION") {
      const existingUser = await findUserByEmail(email);
      if (!existingUser) {
        const user = await createUser({ email, password: hashPassword, role });
        await deleteOtp(verifyOtp.id);
        return okResponse(res, 200, "user is verified successfully", user);
      } else if (!existingUser.isVerified) {
        const user = await updateUserisVerified(email);

        return okResponse(res, 200, "user is verified successfully", user);
      } else {
        throw new Error("user is already veirfied");
      }
    }

    throw new Error("Unhandled OTP type");
  } catch (error) {
    console.log("error in  verify otp  ", error.message);
    next(error);
  }
};

const SendOtpforgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return BadRequestError(res, "user is not Exist !!");
    }
    const otp = generateOtp();
    await smtpServer(email, otp);
    const dbOtp = await createOtp({ email, otp, otpType: "RESET_PASSWORD" });
    okResponse(res, 200, "send otp successfully ", dbOtp.code);
  } catch (error) {
    console.log(`error in send otp for forget password :: ${error.message}`);
    next(error);
  }
};

const verifyOtpAndsetNewPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("user is not exist");
    }
    const verifyOtp = await findOtp(otp);
    if (!verifyOtp) {
      throw new Error("invalid otp");
    }

    if (Date.now > new Date(verifyOtp.expireAt).getTime()) {
      await deleteOtp(verifyOtp.id);
      throw new Error("otp is expired");
    }

    const userSetNewPassword = await updateUserPassword(user.id, newPassword);
    await deleteOtp(verifyOtp.id);
    okResponse(
      res,
      200,
      "sett new password successfully !!",
      userSetNewPassword
    );
  } catch (error) {
    console.log(`error in setNewPassword and verify otp ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    let user = await findUserByEmail(email, role);
    if (!user) {
      return BadRequestError(res, "invalid credentials");
    }
    const matchedPassword = await ComparePassword(password, user.password);
    if (!matchedPassword) {
      return BadRequestError(res, "invalid credientials");
    }
    const token = generateToken(user.id);
    okResponse(res, 200, "user Logged in successfully ", user, token);
  } catch (error) {
    console.log("error in login :: ", error.message);
    next(error);
  }
};


module.exports = {
  registerUser,
  resendOtp,
  verifyOtp,
  SendOtpforgetPassword,
  login,
  verifyOtpAndsetNewPassword,
  
};
