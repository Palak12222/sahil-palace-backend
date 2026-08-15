const express = require("express");
const router  = express.Router();
const db      = require("../db");

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "palakarora955@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SahilHotel@#1718";

// Simple email + password middleware
function checkAuth(req, res, next) {
  const pwd   = String(req.headers["x-admin-password"] || req.query.password || "").trim();
  const email = String(req.headers["x-admin-email"]    || req.query.email || "").trim().toLowerCase();
  if (email !== ADMIN_EMAIL.toLowerCase() || pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

// GET /api/admin/stats
router.get("/stats", checkAuth, async (req, res) => {
  try {
    const [[b]] = await db.execute("SELECT COUNT(*) as total FROM bookings");
    const [[o]] = await db.execute("SELECT COUNT(*) as total FROM orders");
    const [[c]] = await db.execute("SELECT COUNT(*) as total FROM contacts");
    const [[rev]] = await db.execute("SELECT COALESCE(SUM(total),0) as total FROM bookings");
    const [[todayB]] = await db.execute("SELECT COUNT(*) as total FROM bookings WHERE DATE(created_at)=CURDATE()");
    const [[todayO]] = await db.execute("SELECT COUNT(*) as total FROM orders WHERE DATE(created_at)=CURDATE()");
    res.json({
      success: true,
      data: {
        bookings: b.total, orders: o.total, contacts: c.total,
        revenue: rev.total, todayBookings: todayB.total, todayOrders: todayO.total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/bookings
router.get("/bookings", checkAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/orders
router.get("/orders", checkAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/contacts
router.get("/contacts", checkAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM contacts ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/bookings/:id — update booking status
router.patch("/bookings/:id", checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/orders/:id — update order status
router.patch("/orders/:id", checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute("UPDATE orders SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/reviews — get all reviews
router.get("/reviews", checkAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/reviews/:id — approve or reject a review
router.patch("/reviews/:id", checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute("UPDATE reviews SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true, message: "Review status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/events — get all event enquiries
router.get("/events", checkAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM event_enquiries ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/events/:id — mark event enquiry status
router.patch("/events/:id", checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute("UPDATE event_enquiries SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


