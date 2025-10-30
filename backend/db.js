// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432
});

pool.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected successfully!");
    }
});

export default pool;
