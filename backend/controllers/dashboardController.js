const pool = require("../db");

exports.getAnalytics = async (req, res) => {
  try {

    // 1️⃣ Total students
    const totalStudentsResult = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    const totalStudents = Number(totalStudentsResult.rows[0].count);

    // 2️⃣ Total placed
    const placedResult = await pool.query(
      "SELECT COUNT(*) FROM students WHERE is_placed = true"
    );

    const totalPlaced = Number(placedResult.rows[0].count);

    const placementPercentage =
      totalStudents === 0
        ? 0
        : ((totalPlaced / totalStudents) * 100).toFixed(2);

    // 3️⃣ Total companies
    const companyResult = await pool.query(
      "SELECT COUNT(*) FROM companies"
    );

    const totalCompanies = Number(companyResult.rows[0].count);

    // 4️⃣ Branch-wise stats
    const branchStats = await pool.query(`
      SELECT 
        branch,
        COUNT(*) AS total_students,
        COUNT(CASE WHEN is_placed = true THEN 1 END) AS placed_students
      FROM students
      GROUP BY branch
    `);

    // 5️⃣ Average CTC of selected students
    const avgCtcResult = await pool.query(`
      SELECT AVG(c.ctc) AS average_ctc
      FROM applications a
      JOIN companies c ON a.company_id = c.id
      WHERE a.status = 'selected'
    `);

    const averageCtc = avgCtcResult.rows[0].average_ctc
      ? Number(avgCtcResult.rows[0].average_ctc).toFixed(2)
      : 0;

    res.json({
      totalStudents,
      totalPlaced,
      placementPercentage,
      totalCompanies,
      averageCtc,
      branchStats: branchStats.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
