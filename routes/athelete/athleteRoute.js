const athleteRoute = require("express").Router();
const {
  atheleteDetails,
  
} = require("../../controller/athelete/athelete.controller");
const {
  authenticated,
  verifyRole,
} = require("../../middleware/auth.middleware");
const { validateSchema } = require("../../middleware/validate.middleware");
const athletevalidateSchema = require("../../validations/athleteDetails");
const upload = require("../../middleware/multer.middleware");
const {

  getAllNotLike,
  LikePost,
} = require("../../controller/like.controller");

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
  getAllNotLike
);

athleteRoute.post("/like/:id", authenticated, verifyRole("ATHELETE"), LikePost);


module.exports = athleteRoute;
