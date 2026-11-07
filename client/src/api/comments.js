import { request } from "./client";

// GET /posts/:id/comments → all comments on a post
export const getComments = (postId) => request(`/posts/${postId}/comments`);

// POST /posts/:id/comments → add a comment to a post
export const addComment = (postId, content) =>
    request(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });
