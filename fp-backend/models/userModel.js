const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    address: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userModel", userModel);