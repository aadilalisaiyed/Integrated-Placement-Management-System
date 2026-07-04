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
// Add to bottom of studentController.js

exports.getMyProfile = async (req, res) => {
  try {
    // req.user.id is the users table id, match via email
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [req.user.id]
    )

    if (userResult.rows.length === 0)
      return res.status(404).json({ message: 'User not found' })

    const email = userResult.rows[0].email

    const studentResult = await pool.query(
      `SELECT
        id, roll_no, name, email,
        branch, cgpa, graduation_year,
        is_placed, placed_at, created_at
       FROM students
       WHERE email = $1`,
      [email]
    )

    if (studentResult.rows.length === 0)
      return res.status(404).json({ message: 'Student profile not found' })

    res.json(studentResult.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}