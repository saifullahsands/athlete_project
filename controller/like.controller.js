const prisma = require("../lib/prismaClient");
const { okResponse, BadRequestError } = require("../utils");
const { allAthelete } = require("../services/coachDetail.service");

const LikedPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const likeuserid = req.params.id;
    if (parseInt(userId) === parseInt(likeuserid)) {
      return BadRequestError(res, "you cannot like yourself");
    }
    const existingLike = await prisma.feedLike.findFirst({
      where: {
        likedUserId: parseInt(likeuserid),
        likedById: parseInt(userId),
      },
    });

    if (existingLike) {
      await prisma.feedLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.feedLike.create({
        data: {
          likedUserId: parseInt(likeuserid),
          likedById: parseInt(userId),
        },
      });
    }

    okResponse(res, 200, "", null);
  } catch (error) {
    console.log(`error in liking Athelete :: ${error.message}`);
    next(error);
  }
};

const getAllNotLike = async (req, res, next) => {
  try {
    const allAthelet = await allAthelete(req);
    okResponse(res, 200, "get all athelete successfully !! ", allAthelet);
  } catch (error) {
    console.log(`error in get all athelete :: ${error.message}`);
    next(error);
  }
};

const profilesLikedByMe = async (req, res, next) => {
  try {
    const alllike = await prisma.feedLike.findMany({
      where: {
        likedById: req.user.id,
      },
      include: {
        likeUser: {
          select: {
            profileImage: true,
            id: true,
            user_details: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json(alllike);
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).json(error);
  }
};

const CoachesLikedMyProfile = async (req, res, next) => {
  try {
    const wholikeme = await prisma.feedLike.findMany({
      where: {
        likedUserId: req.user.id,
      },
      include: {
        likeBy: {
          select: {
            likeGiven: false,
            likeRecieved: false,

            profileImage: true,
            id: true,
            email: true,
          },
        },
      },
    });

    const cleanData = wholikeme.map((like) => like.likeBy);
    okResponse(res, 200, "get all coaches liked my profiles", cleanData);
  } catch (error) {
    console.log(`error in who have liked me :: ${error.message}`);
    next(error);
  }
};

module.exports = {
  LikedPost,
  getAllNotLike,
  profilesLikedByMe,
  CoachesLikedMyProfile,
};
