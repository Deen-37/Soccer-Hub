import { Router } from "express";
import pool from "../config/db.js";

// mergeParams lets this router read :id from /posts/:id/comments
const router = Router({ mergeParams: true });

// GET /posts/:id/comments → list a post's comments
router.get("/", async (req, res) => {
    try {
        const { id } = req.params;

        // Get comments for this post
        const result = await pool.query(
            `SELECT *
             FROM Comments
             WHERE post_id = $1
             ORDER BY created_at ASC`,
            [id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

// POST /posts/:id/comments → add a comment to a post
router.post("/", async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Require comment text
        if (!content || !content.trim()) {
            return res.status(400).json({
                error: "Comment cannot be empty"
            });
        }

        // Create the comment
        const result = await pool.query(
            `INSERT INTO Comments (content, post_id)
             VALUES ($1, $2)
             RETURNING *`,
            [content, id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
});

export default router;
