const prisma = require("../lib/prismaClient");
const { okResponse } = require("../utils/index");
const {
  createEducation,
  createHeight,
  createdUserDetails,
  getUserDetailsWithExtras,
  updateUserIsProfileCompleted,
  gettingUserDetailWithHeightAndEducation,
  postAchievment,
} = require("../services/userDetail.service");

const fillUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // console.log("user Id is here :: ", userId);
    const {
      achievements,
      first_name,
      last_name,
      DOB,
      gender,
      height,
      address,
      city,
      state,
      phone,
      emailAddress,
      education,
    } = req.body;

    const userDetailing = await createdUserDetails({
      first_name,
      last_name,
      DOB,
      gender,
      address,
      city,
      state,
      phone,
      emailAddress,
      userId,
    });

    await createHeight({
      ft: height?.ft,
      inches: height?.inches,
      weight: height?.weight,
      userDetailId: userDetailing.userId,
    });

    await createEducation({
      school_name: education?.school_name,
      GPA: education?.GPA,
      graduated_year: education?.graduated_year,
      about: education?.about,
      userDetailId: userDetailing.userId,
    });

   const achievment= await Promise.all(
      achievements.map(({ name, year }) => 
        postAchievment({
          nameOfAchievemnt: name,
          yearOfAcheivment: year,
          UserId: userId,
        })
      )
    );
    console.log("achievment :: ",achievment)
    

    await updateUserIsProfileCompleted(userId);
    okResponse(res, 200, "user details filled successfully");
  } catch (error) {
    console.log(`error in fill user details :: ${error.message}`);
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDetail = await gettingUserDetailWithHeightAndEducation(userId);
    delete userDetail.password;
    okResponse(res, 200, "get user Details successfully ", userDetail);
  } catch (error) {
    console.log(`error in get user Details :: ${error.message}`);
    next(error);
  }
};

const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name } = req.body;
    const userDetailing = await prisma.user_Details.update({
      where: {
        userId: parseInt(userId),
      },
      data: {
        last_name: last_name,
        first_name: first_name,
      },
    });
    okResponse(res, 200, "user updated successfully ", userDetailing);
  } catch (error) {
    console.log("error in update User detailing :: ", error.message);
    next(error);
  }
};

const uploadAchievment=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const {achievements}=req.body;
        const achieve=await Promise.all(achievements.map(({name,year})=>
        postAchievment({
            nameOfAchievemnt:name,
            yearOfAcheivment:year,
            UserId:userId
        })
        ))
        okResponse(res,200,"all achievement ",achieve)
    } catch (error) {
        console.log(`error in upload achievments :: ${error.message}`)
        next(error)
    }
}
module.exports = {
  getUserDetails,
  fillUserDetails,
  updateUserDetails,
  uploadAchievment
};
