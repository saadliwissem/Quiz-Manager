const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  joinedAT: { type: Date, default: Date.now },
  role:{type:String,enum:["admin","user"], default:"user"}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
