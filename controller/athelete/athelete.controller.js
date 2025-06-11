const prisma = require("../../lib/prismaClient");
const {
  okResponse,
  BadRequestError,
  pagination,
} = require("../../utils/index");
const {
  createEducation,
  createHeight,
  createdUserDetails,
  updateUserIsProfileCompleted,
  postAchievment,
  findUserByIdAndUpdate,
} = require("../../services/atheleteDetail.service");
const { handleS3Upload } = require("../../utils/continous/handles3Upload");
const { v4: uuidv4 } = require("uuid");

const atheleteDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return BadRequestError(res, "profile Image is required");
    }
    const folderName = "athlincs";
    const file = req.file;
    const fileName = `${uuidv4()}_profile_${Date.now()}_${file.originalname}`;
    const uploadResult = await handleS3Upload(fileName, file, folderName);
    await findUserByIdAndUpdate(userId, uploadResult);

    const {
      achievements,
      first_name,
      last_name,
      DOB,
      gender,
      ft,
      weight,
      inches,
      address,
      city,
      state,
      phone,
      emailAddress,
      school_name,
      GPA,
      graduated_year,
      about,
      coachName,
      currentTeam,
      previousTeam,
      position,
    } = req.body;

    const userDetailing = await createdUserDetails({
      first_name,
      last_name,
      DOB: new Date(DOB),
      gender,
      address,
      city,
      state,
      phone,
      emailAddress,
      coachName,
      currentTeam,
      previousTeam,
      position,
      userId,
    });

    await createHeight({
      ft: ft,
      inches: inches,
      weight: weight,
      userDetailId: userDetailing.userId,
    });

    await createEducation({
      school_name: school_name,
      GPA: GPA,
      graduated_year: graduated_year,
      userDetailId: userDetailing.userId,
    });
    if (Array.isArray(achievements) && achievements.length > 0) {
      await Promise.all(
        achievements.map(
          async ({ name, year }) =>
            await postAchievment({
              nameOfAchievemnt: name,
              yearOfAcheivment: year,
              UserId: userId,
            })
        )
      );
    }

    await updateUserIsProfileCompleted(userId, about);
    okResponse(res, 200, "athelete details insert  successfully");
  } catch (error) {
    console.log(`error in fill user details :: ${error.message}`);
    next(error);
  }
};


const getAllCoaches=async(req,res,next)=>{
  try{
    const allCoaches=await prisma.user.findMany({
      where:{
        NOT:{
          role:req.user.role
        }
          },
      select:{
        email:true,
        profileImage:true,
        user_details:{
          select:{
            first_name:true,
            last_name:true,
            state:true,
            city:true,
            gender:true,
            
          }
        }
      }
    })
    okResponse(res,200,"get all coaches",allCoaches)

  }catch(error){
    console.log(`error in get All Coaches :: ${error.message}`)
    next(error)
  }
}


module.exports = {
  atheleteDetails,
  getAllCoaches
};
