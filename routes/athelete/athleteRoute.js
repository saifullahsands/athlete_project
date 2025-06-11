const athleteRoute = require("express").Router();
const {
  atheleteDetails,
  getAllCoaches,
} = require("../../controller/athelete/athelete.controller");
const {
  authenticated,
  verifyRole,
} = require("../../middleware/auth.middleware");
const { validateSchema } = require("../../middleware/validate.middleware");
const athletevalidateSchema = require("../../validations/athleteDetails");
const upload = require("../../middleware/multer.middleware");
const { CoachesLikedMyProfile } = require("../../controller/like.controller");
const { uploadImageAndVideo } = require("../../controller/media.controller");

athleteRoute.post(
  "/detail",
  authenticated,
  verifyRole("ATHELETE"),
  upload.single("profileImage"),
  validateSchema(athletevalidateSchema),
  atheleteDetails
);

athleteRoute.get(
  "/all-coach",
  authenticated,
  verifyRole("ATHELETE"),
  getAllCoaches
);

athleteRoute.get(
  "/all-coaches-liked-profile",
  authenticated,
  verifyRole("ATHELETE"),
  CoachesLikedMyProfile
);

athleteRoute.post(
  "/upload-images",
  authenticated,
  verifyRole("ATHELETE"),
  upload.array("imag"),
  uploadImageAndVideo
);
module.exports = athleteRoute;
