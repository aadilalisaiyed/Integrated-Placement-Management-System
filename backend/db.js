const { Pool } = require("pg");

// Determine if we are running in production
const isProduction = process.env.NODE_ENV === "production" || (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Aadil@2007@localhost:5432/placement_portal",
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;
