// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.js";
import pool from "./db.js";

dotenv.config();

const app = express();

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(express.json());

// ===== CORS =====
// Allow frontend URL from env, fallback to localhost for development
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ===== Test DB connection =====
pool.connect()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.error("Database connection failed:", err));

// ===== Auto-create attendance table =====
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

// ===== API Routes =====
app.use("/api/attendance", attendanceRoutes);

// ===== Serve frontend (React build) =====
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route for React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
