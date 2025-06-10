const prisma = require("../lib/prismaClient");
const { pagination } = require("../utils/index");
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

const CoachUpdateDetail = async (
  id,
  { coaching_specialization, coaching_experience }
) => {
  return prisma.user.update({
    where: { id },
    data: {
      isProfileComplete: true,
      coaching_experience: parseInt(coaching_experience),
      coaching_specialization,
    },
  });
};

const postWorkExperience = async (id, { name, year }) => {
  return prisma.achievment.createMany({
    data: {
      userId: id,
      name,
      Year: new Date(year),
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

const allAthelete = async (req) => {
  const { skip, perPage } = await pagination(req);
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
  return await prisma.user.findMany({
    skip: skip,
    take: perPage,
    where,
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
  });
};
module.exports = {
  createCoachDetails,
  CoachUpdateDetail,
  postWorkExperience,
  createCertificateImages,
  uploadProfileImage,
  allAthelete,
};
