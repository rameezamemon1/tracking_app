
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      default: "Green Pass"
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    hour: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    }

  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
