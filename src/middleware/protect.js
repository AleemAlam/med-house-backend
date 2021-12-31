const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "failed",
      message: "invalid email or password",
    });
  }

  const token = bearer.split("Bearer ")[1].trim();

  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).json({ status: "failed", message: e.message });
  }

  let user;
  try {
    user = await User.findById(payload.id).lean().exec();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "invalid email or password",
    });
  }
  req.user = user;
  next();
};

module.exports = protect;
