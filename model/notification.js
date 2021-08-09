const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
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
module.exports = Notification = mongoose.model(
  "notificaion",
  NotificationSchema
);
