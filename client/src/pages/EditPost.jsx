import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../constants";
import * as postsApi from "../api/posts";

function EditPost() {
    const [post, setPost] = useState({
        title: "",
        content: "",
        image_url: "",
        category: "",
    })

    const navigate = useNavigate();
    const { id } = useParams();

    const getPost = async () => {
        try {

            // Get the post from Express
            const data = await postsApi.getPost(id);
            setPost(data);
        }
        catch (error) {
            alert(error.message)
        }
    };

    useEffect(() => {
        getPost()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target;

        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };
    const deletePost = async () => {
        try {
            // Delete through Express
            await postsApi.deletePost(id);

            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };


    const updatePost = async (event) => {
        event.preventDefault();

        try {
            // Send updated post to Express
            await postsApi.updatePost(id, post);

            navigate(`/post/${id}`);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <h1> Edit Post</h1>

            <form className="form-card">
                <input
                    type="text"
                    name="title"
                    placeholder="title"
                    value={post.title}
                    onChange={handleChange}
                />

                <br /><br />

                <textarea
                    name="content"
                    placeholder="Content"
                    value={post.content}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={post.image_url}
                    onChange={handleChange}
                />

                <br /><br />

                <select
                    name="category"
                    value={post.category || ""}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <br /><br />

                <div className="form-actions">
                    <button type="submit" onClick={updatePost}>
                        Update Post
                    </button>
                    <button type="button" className="btn-danger" onClick={deletePost}>
                        Delete Post
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditPost;