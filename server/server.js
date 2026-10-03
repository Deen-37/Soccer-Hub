
import bcrypt from "bcrypt"; // Password hashing library
import jwt from "jsonwebtoken";
import pool from "./db.js"; // Import our PostgreSQL connection pool
import express from "express";
import authMiddleware from "./middleware/authMiddleware.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()) // Express: allow us to read JSON request bodies
// Express route: GET /posts

// GET /posts/:id → retrieve one specific post
app.get("/posts/:id", async (req, res) => {
    try {
        // Get the ID from the URL
        const { id } = req.params;

        // Find the post with this ID
        const result = await pool.query(
            "SELECT * FROM Posts WHERE id = $1",
            [id]
        );

        // Return 404 if the post doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Return the requested post
        res.json(result.rows[0]);

    } catch (error) {
        // Handle database errors
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

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


app.post("/posts", authMiddleware, async(req,res) => {
    
    try{
        // Get post data sent by the client
        const { title, content, category, image_url, flag } = req.body;
        const userId = req.userId; // ID added by authMiddleware
         // SQL → insert the new post into PostgreSQL
        const result = await pool.query(
            `INSERT INTO Posts
            (title, content, category, image_url, flag, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [title, content, category, image_url, flag, userId]
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

// PUT /posts/:id → update an existing post
app.put("/posts/:id", authMiddleware, async (req, res) => {
    try {
        // Get the post ID from the URL
        const { id } = req.params;

        // Get the updated data from the request body
        const { title, content, category, image_url, flag } = req.body;

        const userId = req.userId; // ID from the JWT middleware
        // Update the matching post
        const result = await pool.query(
            `UPDATE Posts
             SET title = $1,
                 content = $2,
                 category = $3,
                 image_url = $4,
                 flag = $5
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [title, content, category, image_url, flag, id, userId]
        );

        // Return 404 if the post doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Return the updated post
        res.json(result.rows[0]);

    } catch (error) {
        // Handle database errors
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
});


// DELETE /posts/:id → delete an existing post
app.delete("/posts/:id", authMiddleware, async (req, res) => {
    try {
        // Get the post ID from the URL
        const { id } = req.params;

        const userId = req.userId;
        // Delete the matching post
        // Delete only if the post belongs to the logged-in user
        const result = await pool.query(
            "DELETE FROM Posts WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        // Return 404 if the post doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Confirm the deletion
        res.json({
            message: "Post deleted successfully",
            post: result.rows[0]
        });

    } catch (error) {
        // Handle database errors
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

// POST /auth/register → create a new user
app.post("/auth/register", async (req, res) => {
    try {
        // Get registration data from the request
        const { username, email, password } = req.body;

    // Make sure all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required"
            });
        }
        // Require a minimum password length
        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must be at least 8 characters"
            });
        }
// Check for a basic email format
        if (!email.includes("@")) {
            return res.status(400).json({
                error: "Invalid email address"
            });
        }
        // Require a minimum username length
        if (username.length < 3) {
            return res.status(400).json({
                error: "Username must be at least 3 characters"
            });
        }
        // Check username format
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({
                error: "Username can only contain letters, numbers, and underscores"
            });
        }
        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the user in PostgreSQL
        const result = await pool.query(
            `INSERT INTO Users (username, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, username, email, created_at`,
            [username, email, passwordHash]
        );

        // Return the newly created user
        res.status(201).json(result.rows[0]);

    } catch (error) {
        // Handle duplicate username or email
        if (error.code === "23505") {
            return res.status(409).json({
                error: "Username or email already exists"
            });
        }
        // Handle registration errors
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});


app.post("/auth/login" , async(req, res) => {
    try{
        const {email, password} = req.body;
        // Make sure required fields are provided
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }
        

        const result = await pool.query(
            "SELECT *   FROM Users WHERE email = $1",
            [email]
        )
    // checking whether the user exist
    if (result.rows.length === 0){
        return res.status(401).json({error: "Invalid email or password"})
    }

    // Get the matching user
    const user = result.rows[0]

    // Compare the submitted password with the stored hash

    const passwordMatches = await bcrypt.compare(
        password, 
        user.password_hash
    );
    // reject the wrong passwrod

    if(!passwordMatches){
        return res.status(401).json({error: "Invalid email or password"});
    }


    // create a JWT containing the user's ID

    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: "1hr"}
    )

    // send the token to the client

    res.json({token});

    }catch(error){
        console.error("Error loggin in", error);
        res.status(500).json({error: "Failed to log in"})
    }
})

// Protected test route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated!",
        userId: req.userId
    });
});

// Start the Express server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});