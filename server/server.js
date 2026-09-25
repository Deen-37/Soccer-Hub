
import pool from "./db.js"; // Import our PostgreSQL connection pool
import express from "express";
const app = express();


// Express route: GET /posts
app.get("/posts", async (req, res) => {
    try {
        // SQL query: get all posts from PostgreSQL
        const result = await pool.query("SELECT * FROM Posts");

        // Send the posts back as JSON
        res.json(result.rows);
    } catch (error) {
        // Send an error if the database query fails
        // Show the actual database error
        console.error("Error fetching posts:", error);

        // Send the actual error message to the browser
        res.status(500).json({ error: error.message });
    }
});

// Start the Express server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});