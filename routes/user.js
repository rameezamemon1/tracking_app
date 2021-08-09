const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const User = require("../model/user");
const Notification = require("../model/notification");

// @route   POST /api/users/add
// @desc    Add new user
// @access  Public
router.post(
  "/add",
  [
    check("username", "User Name is Required").not().isEmpty(),
    check("codice_fiscale", "Codice Fiscale is Required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let user = new User(req.body);
      await user.save();
      let newNotification = new Notification({
        message:
          "New User with username " + req.body.username + " has been added.",
        hour: req.body.hour,
        date: req.body.date,
      });
      await newNotification.save();
      res.status(200).json({ user, msg: "User Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page < 0 ? 0 : req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const users = await User.find()
      .sort({ hour: req.query.hourSort })
      .skip(page * limit)
      .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

// @route   GET api/notification
// @desc    Get all notification
// @access  Public
router.get("/notification", async (req, res) => {
  try {
    const notification = await Notification.find().sort({ _id: -1 }).limit(10);
    res.status(200).json(notification);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.delete("/deletedata", async (req, res) => {
  try {
    await User.deleteMany({
      createdAt: {
        $gte: new Date(req.body.datefrom),
        $lte: new Date(req.body.dateto),
      },
    });
    res.status(200).json({ message: "Data deleted" });
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
