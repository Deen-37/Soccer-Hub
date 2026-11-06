import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

// POST /upload → upload an image to Cloudinary
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        // Make sure an image was provided
        if (!req.file) {
            return res.status(400).json({ error: "No image provided" });
        }

        // Upload the image buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "soccer-hub" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });

        // Return the permanent image URL
        res.status(201).json({
            imageUrl: result.secure_url,
        });

    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
});

export default router;
