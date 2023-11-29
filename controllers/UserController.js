const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Validate phone number format using a regular expression
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Check if the user with the provided email or phone number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        console.log("exist");
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      } else {
        return res
          .status(400)
          .json({ error: "User with this phone number already exists" });
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign(
      { userId: user._id },

      "RyyTwyqhIytpayn9cYA1KpXbD2GV1h2q"
    );
    res.status(200).json({ token, name: user.fullName ,id:user._id});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const uploadProfileImage = async(req,res)=>{
  try {
    const userId = req.body.userId;
    const imagePath = req.body.imagePath;


    // Find the user by ID and update the img field with the image path
    const user = await User.findByIdAndUpdate(userId, { img: imagePath }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile image updated successfully', user });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getProfileImage = async(req,res)=>{
  try {
    const userId  = req.params.id;

    // Find the user by ID and retrieve the img field
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imagePath = user.img; // Assuming the path to the image is stored in the 'img' field

    return res.status(200).json({ imagePath });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login,uploadProfileImage,getProfileImage };
