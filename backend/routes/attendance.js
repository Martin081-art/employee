// backend/routes/attendance.js
const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add Attendance
router.post("/", async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;
    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      'INSERT INTO attendance ("employeeName","employeeID","date","status") VALUES ($1,$2,$3,$4) RETURNING id',
      [employeeName, employeeID, date, status]
    );
    res.json({ message: "Attendance added successfully!", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Attendance
router.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Attendance
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM attendance WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
