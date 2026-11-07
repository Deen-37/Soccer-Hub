import { request } from "./client";

// GET /posts → all posts
export const getPosts = () => request("/posts");

// GET /posts/:id → one post
export const getPost = (id) => request(`/posts/${id}`);

// POST /posts → create a post (requires login)
export const createPost = (post) =>
    request("/posts", {
        method: "POST",
        body: JSON.stringify(post),
    });

// PUT /posts/:id → update a post (requires login, owner only)
export const updatePost = (id, post) =>
    request(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(post),
    });

// DELETE /posts/:id → delete a post (requires login, owner only)
export const deletePost = (id) =>
    request(`/posts/${id}`, { method: "DELETE" });

// PUT /posts/:id/upvote → add one upvote
export const upvotePost = (id) =>
    request(`/posts/${id}/upvote`, { method: "PUT" });

// POST /posts/:id/repost → repost as the logged-in user
export const repostPost = (id) =>
    request(`/posts/${id}/repost`, { method: "POST" });
