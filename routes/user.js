const express = require("express");
const router = express.Router();
const User = require("../model/user");
const PlayNotification = require("../model/playnotification");

// @route   POST /api/users/add
// @desc    Add new user
// @access  Public
router.post(
  "/add",
  async (req, res) => {
    try {
      let user = new User(req.body);
      await PlayNotification.findOneAndUpdate({ _id: "612a4c7e54762f32687606fa" }, { play: true })
      await user.save();
      res.status(200).json({ user, msg: "User Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Server Error!");
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/play/notification", async (req, res) => {
  try {
    const playnotification = await PlayNotification.find()
    res.status(200).json(playnotification);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.put("/play/notification", async (req, res) => {
  try {
    const playnotification = await PlayNotification.findOneAndUpdate({ _id: "612a4c7e54762f32687606fa" }, { play: false })
    res.status(200).json(playnotification);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.delete("/deletedata/all", async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All Data deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});
module.exports = router;
