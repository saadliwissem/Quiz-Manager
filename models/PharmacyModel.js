const mongoose = require("mongoose");

// Define the schema for the pharmacy
const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  image: String,
  reviews: Number,
  rate: Number,
  likes: Number,
});

// Create the Pharmacy model using the schema
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
