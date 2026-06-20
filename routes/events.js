const express = require("express");
const router  = express.Router();
const db      = require("../db");

// Auto-create event_enquiries table
(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS event_enquiries (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(100) NOT NULL,
        phone        VARCHAR(20)  NOT NULL,
        email        VARCHAR(100),
        event_type   VARCHAR(100),
        event_date   DATE,
        guests       INT,
        venue        VARCHAR(100),
        message      TEXT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch(e) { console.error("Event enquiries table error:", e.message); }
})();

// POST /api/events — submit event enquiry
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, event_type, event_date, guests, venue, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }
    await db.execute(
      `INSERT INTO event_enquiries (name, phone, email, event_type, event_date, guests, venue, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email || "", event_type || "", event_date || null, guests || null, venue || "", message || ""]
    );
    res.status(201).json({ success: true, message: "Enquiry submitted! We will call you shortly." });
  } catch(err) {
    console.error("Event enquiry error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// GET /api/events — list all enquiries (admin)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM event_enquiries ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
