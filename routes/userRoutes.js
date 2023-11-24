const express = require("express");
const {
register,login
} = require("../controllers/UserController");
const router = express.Router();

// Define routes for User model
router.post("/register",register); // Create a new user
router.post("/login",login); // login user

module.exports = router;
