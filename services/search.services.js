const prisma = require("../lib/prismaClient");

const { pagination } = require("../utils");

const searchFilter = async (req) => {
  const { name, experience, city } = req.query;
  const { skip, perPage, page } = await pagination(req);
  const filter = {
    role: "ATHELETE",
  };

  if (experience) {
    filter.coaching_experience = parseInt(experience);
  }
  if (name || city) {
    const userDetails = {};
    if (name) {
      userDetails.OR = [
        { first_name: { contains: name } },
        { last_name: { contains: name } },
      ];
    }
    if (city) {
      userDetails.city = { contains: city };
    }
    filter.user_details = userDetails;
  }

  const [user, total] = await Promise.all([
    prisma.user.findMany({
      where: filter,
      include: {
        user_details: true,
      },
    }),
    {
      skip,
      take: perPage,
    },
    prisma.user.count({
      where: filter,
    }),
  ]);

  return {
    data: user,
    pagination: {
      total: total,
      totalPage: Math.ceil(total / perPage),
      hasNext: page < Math.ceil(total / perPage),
    },
  };
};

module.exports = {
  searchFilter,
};
