import { request } from "./client";

// POST /upload → upload an image to Cloudinary (requires login)
// Returns { imageUrl } — the permanent link to save as the post's image_url
export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file); // "image" matches upload.single("image") on the server

    return request("/upload", {
        method: "POST",
        body: formData,
    });
};
