const prisma = require("../lib/prismaClient");

const createdUserDetails = async ({
  first_name,
  last_name,
  DOB,
  gender,
  address,
  city,
  state,
  phone,
  emailAddress,
  userId
}) => {
  return prisma.user_Details.create({
    data: {
      first_name,
      last_name,
      DOB: new Date(DOB),
      gender,
      address,
      city,
      state,
      phone,
      emailAddress,
      userId: parseInt(userId),
    },
  });
};

const createHeight = async ({ ft, inches, weight, userDetailId }) => {
  return prisma.height.create({
    data: {
      ft: ft || null,
      inches: inches || null,
      weight: weight || null,
      userDetailId: parseInt(userDetailId), // Make sure it's a number
    },
  });
};


const createEducation = async ({
  school_name,
  GPA,
  graduated_year,
  about,
  userDetailId
}) => {
  return prisma.education.create({
    data: {
      school_name: school_name || null,
      GPA: GPA || null,
      graduated_year: graduated_year ? new Date(graduated_year) : null,
      about: about || null,
      userDetailId: parseInt(userDetailId),
    },
  });
};

const getUserDetailsWithExtras = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    
    include: {
        achievment:true,
        user_details:true,
    },
  });
};

const updateUserIsProfileCompleted = async (userId) => {
    return prisma.user.update({
        where:{
            id:parseInt(userId)
        },
        data:{
            isProfileComplete:true
        }
    })
};



const gettingUserDetailWithHeightAndEducation=async(userId)=>{
    return prisma.user.findUnique({
        where:{
            id:parseInt(userId)
        },
        include:{
            achievment:true,
            user_details:{
                include:{
                    height:true,
                    education:true
                }
            }
        }
    })
}

const postAchievment=async({nameOfAchievemnt,yearOfAcheivment,UserId})=>{
    return prisma.achievment.createMany({
        data:{
            userId:parseInt(UserId),
            name:nameOfAchievemnt || null,
            Year:yearOfAcheivment ? new Date(yearOfAcheivment):null
        }
    })
}
module.exports = {
    postAchievment,
  getUserDetailsWithExtras,
  createEducation,
  createHeight,
  createdUserDetails,
  updateUserIsProfileCompleted,
  gettingUserDetailWithHeightAndEducation
};
