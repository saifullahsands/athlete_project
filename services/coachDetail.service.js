const prisma = require("../lib/prismaClient");

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

module.exports = {
  createCoachDetails,
  CoachUpdateDetail,
  postWorkExperience,
  createCertificateImages,
  uploadProfileImage,
};
