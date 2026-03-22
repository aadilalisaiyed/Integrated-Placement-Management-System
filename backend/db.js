const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "placement_portal",
  password: "Aadil@2007",  
  port: 5432,
});

module.exports = pool;
