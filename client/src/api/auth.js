import { request } from "./client";

// POST /auth/login → returns { token } when email + password are correct
export const login = (credentials) =>
    request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials), // { email, password }
    });

// POST /auth/register → creates a new user
export const register = (user) =>
    request("/auth/register", {
        method: "POST",
        body: JSON.stringify(user), // { username, email, password }
    });
