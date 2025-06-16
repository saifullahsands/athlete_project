const prisma = require("../lib/prismaClient");
const { okResponse } = require("../utils/index");

const getAllsport = async (req, res, next) => {
  try {
    const sports = await prisma.sport.findMany();
    okResponse(res, 200, " ", sports);
  } catch (error) {
    console.log(`error in get all sports :: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getAllsport,
};
