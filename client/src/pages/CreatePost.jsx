import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, FLAGS } from "../constants";
import * as postsApi from "../api/posts";
import { uploadImage } from "../api/upload";


function CreatePost() {
    const [post, setPost] = useState({
        title: "",
        content: "",
        image_url: "",
        category: "",
        flag: "",
    })
    const [imageFile, setImageFile] = useState(null); // the picked image file
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
        try {
            // Upload the image first (if one was picked) to get its Cloudinary link
            let imageUrl = "";
            if (imageFile) {
                const result = await uploadImage(imageFile);
                imageUrl = result.imageUrl;
            }

            // Send the post to our Express API (request() adds the JWT)
            await postsApi.createPost({ ...post, image_url: imageUrl });

            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <h1>Create a New Post</h1>

            <form className="form-card" onSubmit={createPost}>
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

                {/* Image (optional) — saved in imageFile, uploaded on submit */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files[0])}
                />

                <br /><br />
                <div className="create-post-choice">
                    <select
                        name="category"
                        value={post.category}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* Flag: the post's intent (separate from category/topic) */}
                    <select
                        name="flag"
                        value={post.flag}
                        onChange={handleChange}
                    >
                        <option value="">No Flag</option>
                        {FLAGS.map((flag) => (
                            <option key={flag} value={flag}>{flag}</option>
                        ))}
                    </select>

                </div>
                <br /><br />

                <button type="submit">
                    Create Post
                </button>
            </form>
        </div>
    )
}

export default CreatePost;