import { Router } from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// GET /posts → retrieve all posts
router.get("/", async (req, res) => {
    try {
        // SQL query: get all posts from PostgreSQL
        const result = await pool.query("SELECT * FROM Posts");

        // Send the posts back as JSON
        res.json(result.rows);
    } catch (error) {
        // Show the actual database error
        console.error("Error fetching posts:", error);

        // Send the actual error message to the browser
        res.status(500).json({ error: error.message });
    }
});

// GET /posts/:id → retrieve one specific post
router.get("/:id", async (req, res) => {
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

// POST /posts → create a new post
router.post("/", authMiddleware, async (req, res) => {
    try {
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
    } catch (error) {
        // Handle database errors
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// PUT /posts/:id → update an existing post
router.put("/:id", authMiddleware, async (req, res) => {
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
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        // Get the post ID from the URL
        const { id } = req.params;

        const userId = req.userId;

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

// PUT /posts/:id/upvote → add one upvote to a post
router.put("/:id/upvote", async (req, res) => {
    try {
        const { id } = req.params;

        // Increase the post's upvote count by 1
        const result = await pool.query(
            `UPDATE Posts
             SET upvotes = upvotes + 1
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error upvoting post:", error);
        res.status(500).json({ error: "Failed to upvote post" });
    }
});

// POST /posts/:id/repost → copy a post for the logged-in user
router.post("/:id/repost", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Copy the post and assign the repost to the logged-in user
        const result = await pool.query(
            `INSERT INTO Posts
            (title, content, category, image_url, flag, reposted_from, user_id)
            SELECT title, content, category, image_url, flag, id, $2
            FROM Posts
            WHERE id = $1
            RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error reposting:", error);
        res.status(500).json({ error: "Failed to repost post" });
    }
});

export default router;
