const checkImg = async (req, res, next) => {
  if (req.body.post_image_url) {
    next();
  } else {
    next();
  }
};
module.exports = checkImg;
