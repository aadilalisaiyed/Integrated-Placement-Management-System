// backend/controllers/companyController.js

const pool = require('../db')

// Get All Companies
exports.getCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Create Company
exports.createCompany = async (req, res) => {
  try {
    const { name, role, ctc, eligible_branch, min_cgpa, drive_date } = req.body

    if (!name)
      return res.status(400).json({ message: 'Company name is required' })

    const result = await pool.query(
      `INSERT INTO companies (name, role, ctc, eligible_branch, min_cgpa, drive_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, role, ctc, eligible_branch, min_cgpa, drive_date]
    )

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'CREATE', 'COMPANY', result.rows[0].id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update Company
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const { name, role, ctc, eligible_branch, min_cgpa, drive_date } = req.body

    const result = await pool.query(
      `UPDATE companies
       SET name=$1, role=$2, ctc=$3, eligible_branch=$4, min_cgpa=$5, drive_date=$6
       WHERE id=$7
       RETURNING *`,
      [name, role, ctc, eligible_branch, min_cgpa, drive_date, id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Company not found' })

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'UPDATE', 'COMPANY', id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params

    // Delete associated applications first (foreign key)
    await pool.query('DELETE FROM applications WHERE company_id=$1', [id])

    const result = await pool.query(
      'DELETE FROM companies WHERE id=$1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Company not found' })

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'DELETE', 'COMPANY', id]
    )

    res.json({ message: 'Company deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}