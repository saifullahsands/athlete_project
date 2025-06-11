const prisma = require("../lib/prismaClient");
const {
  handleS3Upload,
  okResponse,
  BadRequestError,
} = require("../utils/index");
const { v4: uuidv4 } = require("uuid");

const uploadImageAndVideo = async (req, res, next) => {
  try {
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          let fileType;
          if (file.mimetype.startsWith("image")) {
            fileType = "IMAGE";
          } else if (file.mimetype.startsWith("video")) {
            fileType = "VIDEO";
          } else {
            return BadRequestError(res, "unsupported file type");
          }
          const folder = "athlinc";
          const fileName = `${uuidv4()}_${file.originalname}`;
          const uploadResult = await handleS3Upload(fileName, file, folder);

          await prisma.media.createMany({
            data: {
              type: fileType,
              userId: req.user.id,
              urls: uploadResult,
            },
          });
        })
      );
    }
    okResponse(res, 200, "images and  video upload successfully ", null);
  } catch (error) {
    console.log(`error in upload image and video :: ${error.message}`);
    next(error);
  }
};

module.exports = {
  uploadImageAndVideo,
};
