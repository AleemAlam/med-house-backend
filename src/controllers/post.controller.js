const express = require("express");
const protect = require("./../middleware/protect");
const authorization = require("./../middleware/authorization");
const upload = require("./../utils/file-upload");
const allRoles = require("./../utils/roles");
const Post = require("./../models/post.model");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;
  const offset = (page - 1) * size;
  try {
    const posts = await Post.find()
      .populate("user")
      .skip(offset)
      .limit(size)
      .sort({ created_at: -1 })
      .lean()
      .exec();
    const totalDoc = await Post.find().countDocuments().lean().exec();
    const totalPage = Math.ceil(totalDoc / size);
    res.status(200).json({ status: "success", posts, totalPage, totalDoc });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:userId/my_post", async (req, res) => {
  const { userId } = req.params;
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;
  const offset = (page - 1) * size;
  try {
    const posts = await Post.find({ user: userId })
      .skip(offset)
      .limit(size)
      .lean()
      .exec();
    const totalDoc = await Post.find().countDocuments().lean().exec();
    const totalPage = Math.ceil(totalDoc / size);
    res.status(201).json({ posts, totalPage });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.post(
  "/",
  protect,
  authorization([allRoles.wholeSeller, allRoles.mr]),
  upload.single("post_img"),
  async (req, res) => {
    try {
      const post = await Post.create({
        description: req.body.description,
        user: req.body.user,
        postImg: req.file.path,
      });
      res.status(201).json({ status: "success", post });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

// router.patch(
//   "/:postId/update",
//   protect,
//   authorization([allRoles.wholeSeller, allRoles.mr]),
//   upload.single("profile_pic"),
//   async (req, res) => {
//     const { postId } = req.params;

//     try {
//       const oldPost = await Post.findById(postId);

//       const post = await Post.findByIdAndUpdate(
//         postId,
//         {
//           title: req.body.title || oldPost.title,
//           post_front_image_url: req.file?.path || oldPost.post_front_image_url,
//         },
//         { new: true }
//       );

//       res.status(201).json({ post });
//     } catch (err) {
//       res.status(500).json({ status: "error", message: err.message });
//     }
//   }
// );

router.delete(
  "/:postId",
  protect,
  authorization([allRoles.wholeSeller, allRoles.mr]),
  async (req, res, next) => {
    const { postId } = req.params;
    try {
      const oldPost = await Post.findById(postId);
      if (oldPost.user != user) {
        res
          .status(500)
          .json({ status: "error", message: "you can't delete other's post" });
      }
      const post = await Post.findByIdAndDelete(postId);
      fs.unlinkSync(post.post_front_image_url);
      res.status(201).json({ post });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

module.exports = router;
