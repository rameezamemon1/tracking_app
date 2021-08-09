
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    codice_fiscale: {
      type: String,
      unique: true,
      required: true,
    },
    user_type: {
      type: String,
      enum: ["Greenpass", "Tampone"],
      default:"Greenpass"
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    isAvailable_one: {
      type: Boolean,
      default: false,
    },
    isAvailable_two: {
      type: Boolean,
      default: false,
    },
    isAvailable_four: {
      type: Boolean,
      default: false,
    },
    hour: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = User = mongoose.model("user", UserSchema);
