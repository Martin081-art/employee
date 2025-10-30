// backend/db.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: isProd ? { rejectUnauthorized: false } : false, // Required for Render
});

pool.connect()
  .then(() => console.log(`Database connected successfully! [${process.env.NODE_ENV}]`))
  .catch(err => console.error("Database connection failed:", err));

export default pool;
