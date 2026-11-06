import { Router } from "express";
import bcrypt from "bcrypt"; // Password hashing library
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = Router();

// POST /auth/register → create a new user
router.post("/register", async (req, res) => {
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

// POST /auth/login → check credentials and return a JWT
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Make sure required fields are provided
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM Users WHERE email = $1",
            [email]
        );

        // Check whether the user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Get the matching user
        const user = result.rows[0];

        // Compare the submitted password with the stored hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        // Reject the wrong password
        if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Create a JWT containing the user's ID
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );

        // Send the token to the client
        res.json({ token });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to log in" });
    }
});

export default router;
