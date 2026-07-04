const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

console.log("Email received:", email);
console.log("User from DB:", user);


    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Add this to the bottom of authController.js

exports.register = async (req, res) => {
  try {
    const {
      name, email, password,
      roll_no, branch, cgpa, graduation_year
    } = req.body

    // Validate required fields
    if (!name || !email || !password || !roll_no || !branch) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check email not already taken
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Check roll number not already taken
    const rollCheck = await pool.query(
      'SELECT id FROM students WHERE roll_no = $1', [roll_no]
    )
    if (rollCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Roll number already registered' })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert into users
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, role`,
      [name, email, password_hash]
    )
    const user = userResult.rows[0]

    // Insert into students
    await pool.query(
      `INSERT INTO students (roll_no, name, email, branch, cgpa, graduation_year)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [roll_no, name, email, branch, cgpa || null, graduation_year || null]
    )

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({ token, role: user.role, name: user.name })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}