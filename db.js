const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
  port:     parseInt(process.env.DB_PORT) || 4000,
  user:     process.env.DB_USER     || "jjoRrP2xJn3j5dT.root",
  password: process.env.DB_PASSWORD || "ECmgbGFZXHebBnx9",
  database: process.env.DB_NAME     || "sahil_palace",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit:    5,
  queueLimit:         0,
  connectTimeout:     10000,
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ TiDB Cloud connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ TiDB connection failed:", err.message);
  }
})();

module.exports = pool;
