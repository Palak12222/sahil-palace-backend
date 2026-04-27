// Run this ONCE to create the database and tables on TiDB Cloud
// Usage: node setup-db.js

require("dotenv").config();
const mysql = require("mysql2/promise");

async function setup() {
  console.log("🔧 Connecting to TiDB Cloud...");

  // Connect WITHOUT specifying database first
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
    port:     parseInt(process.env.DB_PORT) || 4000,
    user:     process.env.DB_USER     || "jjoRrP2xJn3j5dT.root",
    password: process.env.DB_PASSWORD || "ECmgbGFZXHebBnx9",
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  });

  console.log("✅ Connected!");

  // Create database
  await conn.execute("CREATE DATABASE IF NOT EXISTS sahil_palace");
  console.log("✅ Database 'sahil_palace' created (or already exists)");

  await conn.execute("USE sahil_palace");

  // Create bookings table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      room_name      VARCHAR(100) NOT NULL,
      room_price     INT          NOT NULL,
      checkin        DATE         NOT NULL,
      checkout       DATE         NOT NULL,
      nights         INT          NOT NULL,
      guests         INT          NOT NULL,
      guest_name     VARCHAR(100) NOT NULL,
      phone          VARCHAR(20)  NOT NULL,
      total          INT          NOT NULL,
      payment_method VARCHAR(20)  DEFAULT 'upi',
      status         VARCHAR(20)  DEFAULT 'pending',
      created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table 'bookings' ready");

  // Create orders table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      items          JSON         NOT NULL,
      total          INT          NOT NULL,
      payment_method VARCHAR(20)  DEFAULT 'upi',
      phone          VARCHAR(20),
      status         VARCHAR(20)  DEFAULT 'pending',
      created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table 'orders' ready");

  // Create contacts table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      phone      VARCHAR(20)  NOT NULL,
      subject    VARCHAR(200),
      message    TEXT,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table 'contacts' ready");

  await conn.end();
  console.log("\n🎉 Database setup complete! You can now start the server with: node server.js");
}

setup().catch(err => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
