const { generateOtp } = require("./continous/generateOtp");
const {
  okResponse,
  Errorhandler,
  BadRequestError,
  validationError,
  unAuthorized,
} = require("./continous/handleError");
const { smtpServer } = require("./continous/sendEmail");
const { HashingPassword, ComparePassword } = require("./helper/bcryptPassword");
const { generateToken } = require("./helper/generateToken");
const { pagination } = require("./helper/pagination");
const { getAgeFromDob } = require("./helper/getAgeFromDob");
const { handleS3Upload } = require("./continous/handles3Upload");
module.exports = {
  generateOtp,
  okResponse,
  Errorhandler,
  HashingPassword,
  ComparePassword,
  smtpServer,
  generateToken,
  BadRequestError,
  validationError,
  unAuthorized,
  pagination,
  getAgeFromDob,
  handleS3Upload,
};
