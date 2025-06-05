const athleteRoute = require("express").Router();
const {
  atheleteDetails,
} = require("../../controller/athelete/atheleteDetail.controller");
const { authenticated, verifyRole } = require("../../middleware/auth.middleware");
const { validateSchema } = require("../../middleware/validate.middleware");
const athletevalidateSchema = require("../../validations/athleteDetails");
const upload = require("../../middleware/multer.middleware");

athleteRoute.post(
  "/detail",
  authenticated,
  verifyRole("ATHELETE"),
  upload.single("profileImage"),
  validateSchema(athletevalidateSchema),
  atheleteDetails
);

module.exports = athleteRoute;
