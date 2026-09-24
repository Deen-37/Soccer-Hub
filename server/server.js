
import pool from "./db.js"; // Import our PostgreSQL connection pool
// Test that Node.js can read from the Posts table
pool.query("SELECT * FROM Posts", (error, result) => {
    if (error) {
        console.error("Posts query failed:", error);
    } else {
        console.log("Posts table connected:", result.rows);
    }
});