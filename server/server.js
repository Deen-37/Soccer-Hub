import "dotenv/config"; // Load server/.env before anything else
import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Allow us to read JSON request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/upload", uploadRoutes);

// Protected test route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated!",
        userId: req.userId
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
