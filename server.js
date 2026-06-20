require("dotenv").config();
const express  = require("express");
const cors     = require("cors");

const bookingsRoute = require("./routes/bookings");
const ordersRoute   = require("./routes/orders");
const contactRoute  = require("./routes/contact");
const adminRoute    = require("./routes/admin");
const reviewsRoute  = require("./routes/reviews");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Phase 4: CORS — allow only your Vercel frontend ────
const allowedOrigins = [
  process.env.FRONTEND_URL,                              // from Render env var
  "https://sahil-palace-frontend-1i8q.vercel.app",       // live Vercel frontend
  "http://localhost:8080",                               // local dev
  "http://127.0.0.1:5500",                              // VS Code Live Server
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
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
