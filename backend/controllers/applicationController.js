const pool = require("../db");

// Public Apply API
exports.applyToCompany = async (req, res) => {
  const { companyId } = req.params;
  const { roll_no, name, email, branch, cgpa, graduation_year } = req.body;

  try {
    // 1️⃣ Check company exists
    const companyCheck = await pool.query(
      "SELECT * FROM companies WHERE id = $1",
      [companyId],
    );

    if (companyCheck.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 2️⃣ Check if student exists
    let studentResult = await pool.query(
      "SELECT * FROM students WHERE roll_no = $1",
      [roll_no],
    );

    let studentId;

    if (studentResult.rows.length === 0) {
      const insertStudent = await pool.query(
        `INSERT INTO students 
         (roll_no, name, email, branch, cgpa, graduation_year)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [roll_no, name, email, branch, cgpa, graduation_year],
      );

      studentId = insertStudent.rows[0].id;
    } else {
      studentId = studentResult.rows[0].id;
    }

    // 3️⃣ Check duplicate application
    const duplicateCheck = await pool.query(
      `SELECT * FROM applications 
       WHERE student_id = $1 AND company_id = $2`,
      [studentId, companyId],
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        message: "You have already applied to this company",
      });
    }

    // 4️⃣ Insert application
    await pool.query(
      `INSERT INTO applications (student_id, company_id)
       VALUES ($1, $2)`,
      [studentId, companyId],
    );

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATED STATUS LOGIC WITH AUDIT LOG
exports.updateApplicationStatus = async (req, res) => {
  console.log("🔥 Update route hit", req.params.id);

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "selected", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status value",
    });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ Get existing application
      const existingApp = await client.query(
        "SELECT * FROM applications WHERE id = $1",
        [id],
      );

      if (existingApp.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Application not found" });
      }

      const currentApp = existingApp.rows[0];

      // Block if already selected
      if (currentApp.status === "selected") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Cannot modify an already selected application",
        });
      }

      // Block same status rewrite
      if (currentApp.status === status) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Application already has this status",
        });
      }

      // If selecting → ensure student not already placed
      if (status === "selected") {
        const studentCheck = await client.query(
          "SELECT is_placed FROM students WHERE id = $1",
          [currentApp.student_id],
        );

        if (studentCheck.rows[0].is_placed) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            message: "Student is already placed",
          });
        }
      }

      // 2️⃣ Update status
      const appResult = await client.query(
        `UPDATE applications
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id],
      );

      const application = appResult.rows[0];

      // 3️⃣ Automation if selected
      if (status === "selected") {
        await client.query(
          `UPDATE students
           SET is_placed = true,
               placed_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [application.student_id],
        );

        await client.query(
          `INSERT INTO alumni (student_id, current_company)
           VALUES ($1, (
             SELECT name FROM companies WHERE id = $2
           ))
           ON CONFLICT (student_id) DO NOTHING`,
          [application.student_id, application.company_id],
        );
      }

      // 4️⃣ AUDIT LOG 🔥
      console.log("About to insert audit log");
      console.log("req.user:", req.user);

      await client.query(
        `INSERT INTO audit_logs (user_id, action, entity, entity_id)
         VALUES ($1, $2, $3, $4)`,
        [
          req.user.id,
          `STATUS_CHANGED_TO_${status.toUpperCase()}`,
          "APPLICATION",
          id,
        ],
      );

      await client.query("COMMIT");

      res.json({ message: "Application status updated successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Applications (Pagination + Filters)
exports.getAllApplications = async (req, res) => {
  try {
    const { status, company_id, branch, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.id AS application_id,
        a.status,
        a.applied_at,

        s.roll_no,
        s.name AS student_name,
        s.branch,
        s.cgpa,
        s.is_placed,

        c.id AS company_id,
        c.name AS company_name,
        c.role,
        c.ctc

      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN companies c ON a.company_id = c.id
      WHERE 1=1
    `;

    const values = [];

    if (status) {
      values.push(status);
      query += ` AND a.status = $${values.length}`;
    }

    if (company_id) {
      values.push(company_id);
      query += ` AND c.id = $${values.length}`;
    }

    if (branch) {
      values.push(branch);
      query += ` AND s.branch = $${values.length}`;
    }

    values.push(limit);
    values.push(offset);

    query += `
      ORDER BY a.applied_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const result = await pool.query(query, values);

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.updated_at,

        s.id AS student_id,
        s.roll_no,
        s.name AS student_name,
        s.email,
        s.branch,
        s.cgpa,
        s.graduation_year,
        s.is_placed,

        c.id AS company_id,
        c.name AS company_name,
        c.role,
        c.ctc,
        c.drive_date

      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN companies c ON a.company_id = c.id
      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
