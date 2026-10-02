// Import JWT so we can verify tokens
import jwt from "jsonwebtoken";

// Authentication middleware
const authMiddleware = (req, res, next) => {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Reject requests without an Authorization header
    if (!authHeader) {
        return res.status(401).json({ error: "Authentication required" });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using our secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the user's ID for the next handler
        req.userId = decoded.userId;

        // Continue to the protected route
        next();

    } catch (error) {
        // Reject invalid or expired tokens
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware; // Make middleware available to server.js