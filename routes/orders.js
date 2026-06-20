const express = require("express");
const router  = express.Router();
const db      = require("../db");

// POST /api/orders — save a food order
// customer_name and address are stored inside the items JSON to avoid schema changes
router.post("/", async (req, res) => {
  try {
    const { items, total, payment_method, phone, customer_name, address } = req.body;
    if (!items || !total) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Pack customer info + items together into one JSON payload
    const fullPayload = {
      customer: { name: customer_name || "", phone: phone || "", address: address || "" },
      items: Array.isArray(items) ? items : []
    };

    const [result] = await db.execute(
      `INSERT INTO orders (items, total, payment_method, phone) VALUES (?, ?, ?, ?)`,
      [
        JSON.stringify(fullPayload),
        total,
        payment_method || "cash",
        phone || ""
      ]
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
