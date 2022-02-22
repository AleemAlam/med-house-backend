const express = require("express");
const Manufacture = require("../models/manufacture.model");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const manufacture = await Manufacture.create(req.body);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
