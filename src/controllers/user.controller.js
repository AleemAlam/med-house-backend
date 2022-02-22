require("dotenv").config();
const newToken = require("../utils/jwt");
const express = require("express");
const router = express.Router();
const User = require("./../models/user.model");
const upload = require("./../utils/file-upload");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

router.post("/signup", upload.single("profile"), async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user)
      return res
        .status(400)
        .send({ status: "failed", message: "user already exists" });

    user = await User.create({ ...req.body, profilePic: req.file.path });
    return res.status(201).json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email }).exec();
    if (!user)
      return res.status(401).json({
        status: "failed",
        message: "invalid email or password",
      });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match)
      return res.status(401).json({
        status: "failed",
        message: "invalid email or password",
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "failed", message: "Something went wrong" });
  }
  const token = newToken(user);
  return res.status(201).json({ status: "success", user: user, token });
});
module.exports = router;
