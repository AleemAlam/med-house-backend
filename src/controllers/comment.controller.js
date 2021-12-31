const express = require("express");
const protect = require("./../middleware/protect");
const authorization = require("./../middleware/authorization");
const Comment = require("../models/comment.model");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.body.post,
      user: req.body.user,
      comment: req.body.comment,
    });
    res.status(201).json({ status: "success", comment });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:postId", protect, async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate("user")
    .lean()
    .exec();
  res.status(201).json({ status: "success", comments });
});

module.exports = router;
