const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

//send sms

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

    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code

    // Create a new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationCode: verificationCode,
    });

    // Save the user to the database
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });

    // Send a verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Specify your email service provider (e.g., Gmail, Outlook, etc.)
      auth: {
        user: "saadliwissem88@gmail.com", // Your email address
        pass: "nynw jmuj tspl lcge", // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: "saadliwissem88@gmail.com",
      to: email,
      subject: "Account Verification",
      text: `Your verification code is: ${verificationCode}. Welcome to pharma-Domi `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send verification email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({
          message: "User registered successfully. Verification email sent.",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//verification code
const CodeVerification = async (req, res) => {
  try {
    const verifyCode = async (userId, code) => {
      try {
        const user = await User.findById(userId);

        if (!user) {
          return { error: "User not found", code: 404 };
        }

        if (user.verificationCode !== code) {
          return { error: "Invalid verification code", code: 400 };
        }

        // Update user verification status
        user.verified = true;
        await user.save();

        return { message: "User verified successfully", code: 200 };
      } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
      }
    };

    const { userId, code } = req.body;

    const result = await verifyCode(userId, code);

    if (result.error) {
      return res.status(result.code).json({ error: result.error });
    }

    res.status(result.code).json({ message: result.message });
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
    res.status(200).json({ token, name: user.fullName, id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.body.userId;
    const imagePath = req.body.imagePath;

    // Find the user by ID and update the img field with the image path
    const user = await User.findByIdAndUpdate(
      userId,
      { img: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile image updated successfully", user });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and retrieve the img field
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imagePath = user.img; // Assuming the path to the image is stored in the 'img' field

    return res.status(200).json({ imagePath });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const changePassword = async (req, res) => {
  try {
    const newPassword = req.body.newpwd;

    const userId = req.body.userId;
    const currentPassword = req.body.currentpwd;
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided current password with the user's stored password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password with the new hashed password
    user.password = hashedNewPassword;

    // Save the updated user to the database
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  uploadProfileImage,
  getProfileImage,
  changePassword,
  CodeVerification,
};
