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
  phone: {
    type: String,
    required: true,
  },
  owner: { type: String, required: true },
  image: String,
});

// Create the Pharmacy model using the schema
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
