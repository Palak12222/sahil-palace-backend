const express = require("express");
const router  = express.Router();
const db      = require("../db");

// Auto-add missing columns if not present
(async () => {
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100) DEFAULT ''`);
    await db.execute(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`);
  } catch(e) { /* columns may already exist */ }
})();

// POST /api/orders — save a food order
router.post("/", async (req, res) => {
  try {
    const { items, total, payment_method, phone, customer_name, address } = req.body;
    if (!items || !total) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const [result] = await db.execute(
      `INSERT INTO orders (customer_name, phone, address, items, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customer_name  || "",
        phone          || "",
        address        || "",
        JSON.stringify(items),
        total,
        payment_method || "cash"
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
