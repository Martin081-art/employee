// server.js (paste exactly)
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.js";
import pool from "./db.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// CORS: allow specific FRONTEND_URL; fallback to same-origin behavior in dev
const FRONTEND = process.env.FRONTEND_URL || "";
if (FRONTEND) {
  app.use(cors({ origin: FRONTEND, methods: ["GET","POST","PUT","DELETE"], credentials: true }));
  console.log("CORS enabled for:", FRONTEND);
} else {
  // allow everything for local dev only (not recommended for prod)
  app.use(cors());
  console.log("CORS: open (no FRONTEND_URL set)");
}

// DB test (do not crash server if DB temporarily down)
pool.connect()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => {
    console.error("Database connection failed (continuing; routes will surface errors):", err.message || err);
  });

// Ensure table creation does not throw unhandled rejection
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        "employeeName" VARCHAR(100),
        "employeeID" VARCHAR(50),
        date DATE,
        status VARCHAR(10)
      )
    `);
    console.log("Attendance table ensured");
  } catch (err) {
    console.error("Error ensuring attendance table:", err.message || err);
  }
})();

// API routes (must be registered before static/catch-all)
app.use("/api/attendance", attendanceRoutes);

// Serve React build (make sure backend/build exists)
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// Catch-all: use a regex route so Express/router won't try to parse wildcards as params
app.get(/.*/, (req, res) => {
  // If index file missing, return a helpful message instead of throwing
  const indexFile = path.join(buildPath, "index.html");
  try {
    res.sendFile(indexFile);
  } catch (err) {
    console.error("sendFile failed:", err);
    res.status(500).send("Frontend not found. Make sure build folder exists in backend/build");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
