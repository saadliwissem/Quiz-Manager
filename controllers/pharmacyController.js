const Pharmacy = require("../models/PharmacyModel"); // Adjust the path as needed

// Create a new pharmacy
const createPharmacy = async (req, res) => {
  try {
    // Extract data from the request body sent by the front-end
    const { pharmacyName, ownerName, phoneNumber, longitude, latitude } =
      req.body;

    // Check if the phone number has 8 digits
    if (!/^\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({ error: "Phone number should be 8 digits" });
    }

    // Check if the pharmacy with the same name already exists
    const existingPharmacy = await Pharmacy.findOne({ name: pharmacyName });
    const existingPharmacyByPhone = await Pharmacy.findOne({ phone: phoneNumber });
    if (existingPharmacy) {
      return res.status(409).json({ error: "Pharmacy already exists" });
    }
    if (existingPharmacyByPhone) {
      return res.status(409).json({ error: "Phone number already exists" });
    }
    // Create a new instance of the Pharmacy model with the extracted data
    const newPharmacy = new Pharmacy({
      name: pharmacyName,
      owner: ownerName,
      phone: phoneNumber,
      longitude: parseFloat(longitude), // Convert to Number if required
      latitude: parseFloat(latitude), // Convert to Number if required
      // Add other fields from the front-end if present
      // image: req.body.image,
    });

    // Save the new pharmacy to the database
    await newPharmacy.save();

    // Send a success response with the created pharmacy data
    res.status(201).json(newPharmacy);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Error creating pharmacy" });
  }
};


// Get all pharmacies
const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: "Error getting pharmacies" });
  }
};

// Get a specific pharmacy by ID
const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    res.status(200).json(pharmacy);
  } catch (error) {
    res.status(500).json({ error: "Error getting pharmacy" });
  }
};

// Update a pharmacy by ID
const updatePharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    res.status(200).json(pharmacy);
  } catch (error) {
    res.status(500).json({ error: "Error updating pharmacy" });
  }
};

// Delete a pharmacy by ID
const deletePharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndRemove(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: "Error deleting pharmacy" });
  }
};

module.exports = {
  updatePharmacyById,
  deletePharmacyById,
  createPharmacy,
  getAllPharmacies,
  getPharmacyById,
};
