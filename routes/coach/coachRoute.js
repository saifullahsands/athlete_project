const {
  CoachDetails,
  getAlldetailsAthleteProfile,
} = require("../../controller/coach/coachDetail.controller");
const {
  authenticated,
  verifyRole,
} = require("../../middleware/auth.middleware");
const { validateSchema } = require("../../middleware/validate.middleware");
const CoachvalidateSchema = require("../../validations/coachValidition");
const upload = require("../../middleware/multer.middleware");

const {
  getAllNotLike,
  LikedPost,
  profilesLikedByMe,
} = require("../../controller/like.controller");
const { searchingAthelete } = require("../../controller/search.controller");

const coachRoute = require("express").Router();

coachRoute.post(
  "/detail",
  authenticated,
  verifyRole("COACH"),
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "certificateImage" },
  ]),
  validateSchema(CoachvalidateSchema),
  CoachDetails
);

coachRoute.get(
  "/all-athelete",
  authenticated,
  verifyRole("COACH"),
  getAllNotLike
);

coachRoute.post("/like/:id", authenticated, verifyRole("COACH"), LikedPost);

coachRoute.get(
  "/liked-athletes",
  authenticated,
  verifyRole("COACH"),
  profilesLikedByMe
);

coachRoute.get(
  "/search-athlete",
  authenticated,
  verifyRole("COACH"),
  searchingAthelete
);

coachRoute.get(
  "/get-athelete-profile",
  authenticated,
  verifyRole("COACH"),
  getAlldetailsAthleteProfile
);
module.exports = coachRoute;
