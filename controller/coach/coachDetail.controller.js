const {
  createCoachDetails,
  CoachUpdateDetail,
  createCertificateImages,
  uploadProfileImage,
  postWorkExperience,
} = require("../../services/coachDetail.service");
const { handleS3Upload } = require("../../utils/continous/handles3Upload");
const { BadRequestError, okResponse } = require("../../utils/index");
const { v4: uuidv4 } = require("uuid");

const CoachDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      first_name,
      last_name,
      DOB,
      gender,
      address,
      city,
      state,
      emailAddress,
      phone,
      coaching_specialization,
      coaching_experience,
      work_experience,
    about
    } = req.body;

    const profileImage = req.files?.profileImage?.[0];

    if (!profileImage) {
      return BadRequestError(res, "profile Image is required");
    }
    const folderName = "athlincs";
    const profileImagefileName = `${uuidv4()}_${profileImage.originalname}`;
    const profileImageUrl = await handleS3Upload(
      profileImagefileName,
      profileImage,
      folderName
    );
    await uploadProfileImage(userId, profileImageUrl,about);

    const certificatImage = req.files?.certificateImage;
    if (!certificatImage) {
      return BadRequestError(res, "certificate Image is required");
    }

    await Promise.all(
      certificatImage.map(async (file) => {
        const fileName = `${uuidv4()}_${file.originalname}`;
        const resultUrl = await handleS3Upload(fileName, file, folderName);
        await createCertificateImages(userId, resultUrl);
      })
    );

    await createCoachDetails({
      first_name,
      last_name,
      DOB:new Date(DOB),
      gender,
      address,
      city,
      state,
      emailAddress,
      phone,
      userId,
    });

    await CoachUpdateDetail(userId, {
      coaching_specialization,
      coaching_experience,
    });
    
    await Promise.all(
      work_experience.map(async ({ name, year }) => {
        await postWorkExperience(userId, { name, year });
      })
    );

    okResponse(res, 201, "coach details insert successfully", null);
  } catch (error) {
    console.log(`error in Coach Details :: ${error.message}`);
    next(error);
  }
};

module.exports = {
  CoachDetails,
};
