// Base URL of the Express server, read from client/.env
// Falls back to localhost so the app still works without a .env file
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Send a request to the API and return the JSON response.
// Every API call in the app goes through this one function.
export async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    // Files are sent as FormData; the browser sets their Content-Type itself
    const isFile = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            // Send JSON for everything except file uploads
            ...(!isFile && { "Content-Type": "application/json" }),
            // Attach the JWT only when the user is logged in
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await response.json();

    // Turn a failed response into an error with the server's message
    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}
