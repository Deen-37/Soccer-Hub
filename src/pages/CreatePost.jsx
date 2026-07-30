import { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";


function CreatePost() {
    const [post, setPost] = useState({
        title: "",
        content: "",
        image_url: "",
        category: "",
        secret_key: ""
    })
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { name, value } = event.target;

        setPost((prevPost) => ({
            ...prevPost,        // Keep existing fields
            [name]: value,      // Update only the field being edited
        }));
    };
    const createPost = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from("Posts")
            .insert([post])
        if (error) {
            alert(error.message);
            return;
        }
        navigate("/")
    }
    return (
        <div>
            <h1>Create a New Post</h1>

            <form onSubmit={createPost}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={post.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="content"
                    placeholder="Write your post..."
                    value={post.content}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL (optional)"
                    value={post.image_url}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={post.category}
                    onChange={handleChange}
                />
                {/* Secret key */}
                <input
                    type="password"
                    name="secret_key"
                    placeholder="Secret Key"
                    value={post.secret_key} // User's secret key
                    onChange={handleChange} // Update state
                />

                <br /><br />

                <button type="submit">
                    Create Post
                </button>
            </form>
        </div>
    )
}

export default CreatePost;