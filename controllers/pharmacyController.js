const Pharmacy = require("../models/PharmacyModel"); // Adjust the path as needed

// Create a new pharmacy
const createPharmacy = async (req, res) => {
  try {
    const newPharmacy = new Pharmacy(req.body);
    await newPharmacy.save();
    res.status(201).json(newPharmacy);
  } catch (error) {
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
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
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

module.exports={updatePharmacyById,deletePharmacyById,createPharmacy,getAllPharmacies,getPharmacyById}