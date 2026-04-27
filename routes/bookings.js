const express = require("express");
const router  = express.Router();
const db      = require("../db");

// POST /api/bookings — save a room booking
router.post("/", async (req, res) => {
  try {
    const { room_name, room_price, checkin, checkout, nights, guests, guest_name, phone, total, payment_method } = req.body;

    if (!room_name || !checkin || !checkout || !guest_name || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const [result] = await db.execute(
      `INSERT INTO bookings (room_name, room_price, checkin, checkout, nights, guests, guest_name, phone, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [room_name, room_price, checkin, checkout, nights, guests, guest_name, phone, total, payment_method || "upi"]
    );

    res.status(201).json({
      success: true,
      message: "Booking confirmed!",
      bookingId: result.insertId,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// GET /api/bookings — list all bookings (admin use)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
