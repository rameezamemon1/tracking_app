const mongoose = require("mongoose");

const PlayNotification = new mongoose.Schema(
    {
        play: {
            type: Boolean,
        }
    },
    { timestamps: true }
);

module.exports = User = mongoose.model("playnotification", PlayNotification);
