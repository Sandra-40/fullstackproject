const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const { protect, admin } = require("../middleware/auth");

// Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({ donors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get donor by ID
router.get("/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.status(200).json({ donor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add donor (Admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, age, email, phone, blood, ailment } = req.body;

    // Validation
    if (!name || !age || !email || !phone || !blood) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const donor = new Donor({
      name,
      age,
      email,
      phone,
      blood,
      ailment: ailment || "None",
    });

    await donor.save();
    res.status(201).json({
      message: "Donor added successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update donor (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, age, email, phone, blood, ailment, unitsAvailable } = req.body;

    let donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    donor.name = name || donor.name;
    donor.age = age || donor.age;
    donor.email = email || donor.email;
    donor.phone = phone || donor.phone;
    donor.blood = blood || donor.blood;
    donor.ailment = ailment || donor.ailment;
    donor.unitsAvailable = unitsAvailable || donor.unitsAvailable;

    await donor.save();
    res.status(200).json({
      message: "Donor updated successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete donor (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.status(200).json({
      message: "Donor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get donors by blood type
router.get("/blood/:bloodType", async (req, res) => {
  try {
    const donors = await Donor.find({ blood: req.params.bloodType });
    res.status(200).json({ donors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
