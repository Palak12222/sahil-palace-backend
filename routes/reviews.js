const express = require("express");
const router  = express.Router();
const db      = require("../db");

// Auto-create reviews table if not exists
(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        location   VARCHAR(100),
        rating     INT          DEFAULT 5,
        message    TEXT         NOT NULL,
        status     VARCHAR(20)  DEFAULT 'pending',
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch(e) { console.error("Reviews table error:", e.message); }
})();

// POST /api/reviews — submit a review (public)
router.post("/", async (req, res) => {
  try {
    const { name, location, rating, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, message: "Name and message are required" });
    }
    const r = Math.min(5, Math.max(1, parseInt(rating) || 5));
    await db.execute(
      `INSERT INTO reviews (name, location, rating, message) VALUES (?, ?, ?, ?)`,
      [name.trim(), location?.trim() || "", r, message.trim()]
    );
    res.status(201).json({ success: true, message: "Review submitted! It will appear after approval." });
  } catch(err) {
    console.error("Review error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// GET /api/reviews — get approved reviews (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, location, rating, message, created_at FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 20"
    );
    res.json({ success: true, data: rows });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
