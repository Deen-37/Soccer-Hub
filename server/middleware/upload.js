import multer from "multer";

// Store uploaded images temporarily in memory
const storage = multer.memoryStorage();

// Configure image upload restrictions
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximum 5 MB
    },
    fileFilter: (req, file, callback) => {
        // Accept only image files
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Only image files are allowed"));
        }
    },
});

export default upload;
