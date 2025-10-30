// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./db.js";
import attendanceRoutes from "./routes/attendance.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Auto-create attendance table if it doesn't exist
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

// API routes
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
