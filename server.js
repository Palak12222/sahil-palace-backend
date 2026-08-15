require("dotenv").config();
const express  = require("express");
const cors     = require("cors");

const bookingsRoute = require("./routes/bookings");
const ordersRoute   = require("./routes/orders");
const contactRoute  = require("./routes/contact");
const adminRoute    = require("./routes/admin");
const reviewsRoute  = require("./routes/reviews");
const eventsRoute   = require("./routes/events");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Phase 4: CORS — allow custom domain & all frontends ────
app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any origin (reflects incoming Origin header in Access-Control-Allow-Origin)
    return callback(null, true);
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-password", "x-admin-email"],
  credentials: true,
}));

app.use(express.json());

// ── Root route ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sahil Palace Backend is running 🚀"
  });
});

// ── Health check (Render uses this to confirm service is up) ──
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Sahil Palace & Restaurant API",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ── API Routes ──────────────────────────────────────────
app.use("/api/bookings", bookingsRoute);
app.use("/api/orders",   ordersRoute);
app.use("/api/contact",  contactRoute);
app.use("/api/admin",    adminRoute);
app.use("/api/reviews",  reviewsRoute);
app.use("/api/events",   eventsRoute);

// ── 404 ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Sahil Palace API running on port ${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
});
