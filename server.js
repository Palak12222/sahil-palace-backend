require("dotenv").config();
const express  = require("express");
const cors     = require("cors");

const bookingsRoute = require("./routes/bookings");
const ordersRoute   = require("./routes/orders");
const contactRoute  = require("./routes/contact");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Phase 4: CORS — allow only your Vercel frontend ────
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://sahil-palace.vercel.app
  "http://localhost:8080",            // local dev
  "http://127.0.0.1:5500",           // VS Code Live Server
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

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
