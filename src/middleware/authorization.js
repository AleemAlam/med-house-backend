const User = require("../models/user.model");

const authorization = (userRole) => {
  return async (req, res, next) => {
    if (!userRole || userRole?.length == 0) {
      return next();
    }

    const user = req.user;
    const userAllowed = await User.findOne({
      _id: user._id,
      businessType: { $in: userRole },
    })
      .lean()
      .exec();
    if (userAllowed) return next();
    return res
      .status(401)
      .json({ status: "failed", message: "User not found" });
  };
};

module.exports = authorization;
