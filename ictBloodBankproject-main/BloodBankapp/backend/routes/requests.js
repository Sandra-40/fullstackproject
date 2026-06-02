const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const { protect, admin } = require("../middleware/auth");

// Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create request
router.post("/", protect, async (req, res) => {
  try {
    const { name, age, email, phone, blood, category, ailment, unitsRequired } =
      req.body;

    // Validation
    if (
      !name ||
      !age ||
      !email ||
      !phone ||
      !blood ||
      !category ||
      !unitsRequired
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const request = new Request({
      name,
      age,
      email,
      phone,
      blood,
      category,
      ailment: ailment || "None",
      unitsRequired,
    });

    await request.save();
    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update request status (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete request (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get requests by status
router.get("/status/:status", async (req, res) => {
  try {
    const requests = await Request.find({ status: req.params.status });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
