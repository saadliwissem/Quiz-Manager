const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String }, // Address is not required
  img: { type: String },
  verificationCode: { type: String, required: false },
  verified: { type: Boolean, required: false, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
