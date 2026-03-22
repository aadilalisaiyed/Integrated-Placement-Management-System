const pool = require("../db");

exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        roll_no,
        name,
        email,
        branch,
        cgpa,
        graduation_year,
        is_placed,
        placed_at,
        created_at
      FROM students
      ORDER BY created_at DESC
      `
    );

    res.json({
      total: result.rows.length,
      students: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
