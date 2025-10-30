const express = require('express');
const router = express.Router();
const db = require('../db');

// Add Attendance
router.post('/', (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO Attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)";
  db.query(sql, [employeeName, employeeID, date, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Attendance added successfully!", id: result.insertId });
  });
});

// Get All Attendance
router.get('/', (req, res) => {
  const sql = "SELECT * FROM Attendance ORDER BY date DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// Delete Attendance by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Attendance WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Attendance record deleted successfully" });
  });
});

module.exports = router;
