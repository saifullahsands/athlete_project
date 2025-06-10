const JWT = require("jsonwebtoken");
const prisma = require("../lib/prismaClient");
const { TOKEN_SECRET_KEY } = require("../config/env.config");
const { BadRequestError, unAuthorized } = require("../utils/index");

const authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!req.headers || !authHeader.startsWith("Bearer ")) {
      return BadRequestError(res, "token is not found and malformed");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = JWT.verify(token, TOKEN_SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(decoded.id),
      },
    });

    if (!user) {
      return unAuthorized(res, "Un Authorized");
    }
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof JWT.JsonWebTokenError) {
      return unAuthorized(res, "your token is expired");
    }
    console.log("error in auth middleware :: ", error.message);
    next(error);
  }
};

const verifyRole = (role) => {
  try {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return BadRequestError(res, `this routes can only ${role} can access`);
      }

      next();
    };
  } catch (error) {
    console.log(`error in role verification ::  ${error.message}`);
    next(error);
  }
};

module.exports = {
  verifyRole,
  authenticated,
};
