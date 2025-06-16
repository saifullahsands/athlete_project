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
  creatSportsList,
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
      sportData,
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
      userId,
    });

    console.log("SPORT DATAAAA :: ", sportData);

    await createHeight({
      ft: ft,
      inches: inches,
      weight: weight,
      userDetailId: userDetailing.userId,
    });
    await creatSportsList(userId, sportData);
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

const getAllCoaches = async (req, res, next) => {
  try {
    const { skip, perPage, page } = await pagination(req);
    const [caoches, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          NOT: {
            role: req.user.role,
          },
          isProfileComplete: true,
        },
        skip,
        take: perPage,

        select: {
          id: true,
          profileImage: true,
          user_details: {
            select: {
              first_name: true,
              last_name: true,
              state: true,
              city: true,
              gender: true,
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          NOT: {
            role: req.user.role,
          },
          isProfileComplete: true,
        },
      }),
    ]);
    okResponse(res, 200, "get all coaches", {
      caoches,
      pagination: {
        total: total,
        totalPage: Math.ceil(total / perPage),
        hasNext: page < Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.log(`error in get All Coaches :: ${error.message}`);
    next(error);
  }
};

const viewCoachProfile = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const findCoachDetails = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
        role:"COACH"
      },
      select: {
        role: true,
        profileImage: true,
        achievment: {
          select: {
            name: true,
            year: true,
          },
        },
        certificate: {
          select: {
            urls: true,
          },
        },
        about: true,
        user_details: true,
      },
    });

    okResponse(
      res,
      200,
      "get coach profile successfully :: ",
      findCoachDetails
    );
  } catch (error) {
    console.log(`error in view Coach Profile :: ${error.message}`);
    next(error);
  }
};
module.exports = {
  atheleteDetails,
  getAllCoaches,
  viewCoachProfile,
};
