const express = require("express");
const router  = express.Router();
const db      = require("../db");

// POST /api/orders — save a food order
router.post("/", async (req, res) => {
  try {
    const { items, total, payment_method, phone } = req.body;
    if (!items || !total) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const [result] = await db.execute(
      `INSERT INTO orders (items, total, payment_method, phone) VALUES (?, ?, ?, ?)`,
      [JSON.stringify(items), total, payment_method || "upi", phone || ""]
    );
    res.status(201).json({ success: true, message: "Order placed!", orderId: result.insertId });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// GET /api/orders — list all orders (admin)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
