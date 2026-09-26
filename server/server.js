
import pool from "./db.js"; // Import our PostgreSQL connection pool
import express from "express";
const app = express();
app.use(express.json()) // Express: allow us to read JSON request bodies

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

app.post("/posts", async(req,res) => {
    
    try{
        // Get post data sent by the client
        const { title, content, category, image_url, secret_key, flag } = req.body;
        
         // SQL → insert the new post into PostgreSQL
        const result = await pool.query(
            `INSERT INTO Posts
            (title, content, category, image_url, secret_key, flag)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [title, content, category, image_url, secret_key, flag]
        );
         // Send the newly created post back as JSON
        res.status(201).json(result.rows[0]);
    }catch (error) {
        // Handle database errors
        console.error("Error creating post:", error);

        // Send an error response
        res.status(500).json({ error: "Failed to create post" });
    }

})


// Start the Express server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});