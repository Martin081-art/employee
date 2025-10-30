const express = require("express");
const cors = require("cors");
const path = require("path");
const attendanceRoutes = require("./routes/attendance");
const pool = require("./db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection with a simple query
pool.query('SELECT NOW()')
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.error("Database connection failed:", err));

// Auto-create attendance table
pool.query(`
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    "employeeName" VARCHAR(100),
    "employeeID" VARCHAR(50),
    "date" DATE,
    "status" VARCHAR(10)
)
`)
.then(() => console.log("Attendance table is ready"))
.catch(err => console.error("Error creating attendance table:", err));

// API Routes
app.use("/api/attendance", attendanceRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
