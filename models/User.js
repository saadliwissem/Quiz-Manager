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
  gender: { type: String, enum: ["male", "female"] }, // Enum restricts the value to 'male' or 'female'
  age: { type: Number }, // Age as an integer
  joinedAT: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
