const prisma = require("../lib/prismaClient");
const { pagination, BadRequestError } = require("../utils/index");
const {getAgeFromDob}=require("../utils/helper/getAgeFromDob")



const createCoachDetails = async ({
  first_name,
  last_name,
  DOB,
  gender,
  address,
  city,
  state,
  emailAddress,
  phone,
  userId,
}) => {
  return prisma.user_Details.create({
    data: {
      first_name,
      last_name,
      DOB,
      gender,
      address,
      city,
      state,
      emailAddress,
      phone,
      userId,
    },
  });
};

const CoachUpdateDetail = async (id, { coaching_experience }) => {
  return prisma.user.update({
    where: { id },
    data: {
      isProfileComplete: true,
      coaching_experience: parseInt(coaching_experience),
    },
  });
};

const postWorkExperience = async (id, { name, year }) => {
  return prisma.achievment.createMany({
    data: {
      userId: id,
      name,
      year:parseInt(year),
    },
  });
};

const createCertificateImages = async (userId, urls) => {
  return prisma.certificateImage.createMany({
    data: {
      userId: userId,
      urls,
    },
  });
};

const uploadProfileImage = async (userId, url, about) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage: url,
      about,
    },
  });
};

const creatSportsList = async (userId, sportIds) => {
  return prisma.userSports.createMany({
    data: sportIds.map((id) => ({
      userId: parseInt(userId),
      sportId: parseInt(id),
    })),
    skipDuplicates: true,
  });
};

const allAthelete = async (req) => {
  const { skip, perPage, page } = await pagination(req);
  let where = {
    isProfileComplete: true,
  };
  console.log(req.user.id, "ID");
  if (req.user.role == "ATHELETE") {
    where = {
      ...where,
      role: "COACH",
    };
  } else {
    where = {
      ...where,
      role: "ATHELETE",
      likeRecieved: {
        none: {
          likedById: req.user.id,
        },
      },
    };
  }
  console.log(where, "WHERE");
  const [users, total] = await Promise.all([
    await prisma.user.findMany({
      where,
      skip,
      take: perPage,
      select: {
        role: true,
        about: true,
        profileImage: true,
        id: true,
        user_details: {
          select: {
            first_name: true,
            last_name: true,
            city: true,
            state: true,
            DOB: true,
            gender: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    data: users,
    pagination: {
      total: total,
      totalPage: Math.ceil(total / perPage),
      hasNext: page < Math.ceil(total / perPage),
    },
  };
};



const getAthleteProfile = async (req) => {
  const { type = "about" } = req.query;
  const { userId } = req.body;
  if (type == "about") {
    const user = await prisma.user.findUnique({
      where: {
        id:parseInt(userId),
        role:"ATHELETE",
        isProfileComplete: true,
      },
      select: {
        profileImage: true,
        role: true,
        about: true,
        achievment: {
          select: {
            name: true,
            year: true,
          },
        },
        userSports: {
          select: {
            position: true,
            sport: {
              select: {
                name: true,
              },
            },
          },
        },
        certificate: {
          select: {
            urls: true,
          },
        },

        user_details: {
          include: {
            education: true,
            height: true,
          },
        },
      },
    });

    
    const age = user.user_details?.DOB ? getAgeFromDob(user.user_details?.DOB) : null;
    const sport = user.userSports.map((us) => ({
      name: us.sport?.name || null,
      position: us.position || null,
    }));
    const certificate = user.certificate.map((cert) => cert.urls);
    const achievments = user.achievment.map((ach) => ({
      id: ach.id,
      name: ach.name,
      year: ach.Year,
    }));

    const details = user.user_details
      ? {
          first_name: user.user_details.first_name,
          last_name: user.user_details.last_name,
          DOB: user.user_details.DOB,
          age: age,
          gender: user.user_details.gender,
          address: user.user_details.address,
          city: user.user_details.city,
          state: user.user_details.state,
          phone: user.user_details.phone,
          emailAddress: user.user_details.emailAddress,
          position: user.user_details.position,
          currentTeam: user.user_details.currentTeam,
          previousTeam: user.user_details.previousTeam,
          coachName: user.user_details.coachName,
          education: user.user_details.education || null,
          height: user.user_details.height || null,
        }
      : null;

    return {
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      about: user.about,
      achievments,
      sport,
      certificate,
      user_details: details,
    };
  } else if (type == "image") {
    return await prisma.media.findMany({
      where: {
        userId:parseInt(userId),
        type: "IMAGE",
      },
    });
  } else if (type == "video") {
    return await prisma.media.findMany({
      where: {
        userId:parseInt(userId),
        type: "VIDEO",
      },
    });
  }
};

module.exports = {
  createCoachDetails,
  CoachUpdateDetail,
  postWorkExperience,
  createCertificateImages,
  uploadProfileImage,
  allAthelete,
  creatSportsList,
  getAthleteProfile,
};
