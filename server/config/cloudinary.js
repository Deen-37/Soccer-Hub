import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using our private credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export the configured Cloudinary client for other files
export default cloudinary;