import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

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

            //Get the post from Express
            const response = await fetch(`http://localhost:3000/posts/${id}`);
            if (!response) {
                throw new Error("Failed to fetch post");
            }

            const data = await response.json();
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
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };


    const updatePost = async (event) => {
        event.preventDefault();

        try {
            // Send updated post to Express
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

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

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={post.category}
                    onChange={handleChange}
                />
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