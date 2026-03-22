const pool = require("../db");

// Create Company
exports.createCompany = async (req, res) => {
  try {
    const { name, role, ctc, eligible_branch, min_cgpa, drive_date } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const result = await pool.query(
      `INSERT INTO companies 
      (name, role, ctc, eligible_branch, min_cgpa, drive_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [name, role, ctc, eligible_branch, min_cgpa, drive_date],
    );
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id)
   VALUES ($1, $2, $3, $4)`,
      [req.user.id, "CREATE", "COMPANY", result.rows[0].id],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Companies
exports.getCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM companies ORDER BY created_at DESC",
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
