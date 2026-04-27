const express = require("express");
const router  = express.Router();
const db      = require("../db");

// POST /api/contact — save contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }
    await db.execute(
      `INSERT INTO contacts (name, phone, subject, message) VALUES (?, ?, ?, ?)`,
      [name, phone, subject || "", message || ""]
    );
    res.status(201).json({ success: true, message: "Message received! We will contact you shortly." });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

module.exports = router;
