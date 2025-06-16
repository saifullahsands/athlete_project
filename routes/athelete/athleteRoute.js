const athleteRoute = require("express").Router();
const {
  atheleteDetails,
  getAllCoaches,
  viewCoachProfile,
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
const { searchingAthelete } = require("../../controller/search.controller");

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
  "/coaches-liked-my-profile",
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

athleteRoute.get(
  "/search-coach",
  authenticated,
  verifyRole("ATHELETE"),
  searchingAthelete
);

athleteRoute.get(
  "/view-coach-profile",
  authenticated,
  verifyRole("ATHELETE"),
  viewCoachProfile
);
module.exports = athleteRoute;
