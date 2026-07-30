import { useEffect, useState } from "react";
import { supabase } from "../client";
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
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            alert(error);
            return;
        }


        setPost(data);
    }

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
    const deletePost = async (event) => {
        // no event.preventDefault() because deleting is not form submission
        const enteredKey = prompt("Enter your secret key:");

        if (enteredKey !== post.secret_key) {
            alert("Incorrect secret key.");
            return;
        }
        const { error } = await supabase
            .from("Posts")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        navigate("/");
    };


    const updatePost = async (event) => {
        event.preventDefault(); //asks for secret key
        const enteredKey = prompt("Enter your secret key:");

        if (enteredKey !== post.secret_key) {
            alert("Incorrect secret key.");
            return;
        }
        const { error } = await supabase
            .from("Posts")
            .update({
                title: post.title,
                content: post.content,
                image_url: post.image_url,
                category: post.category,
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        navigate(`/post/${id}`);
    };

    return (
        <div>
            <h1> Edit Post</h1>

            <form >
                <input
                    type="text"
                    name="title"
                    placeholder="title"
                    value={post.title}
                    onChange={handleChange}
                />

                <textarea
                    name="content"
                    placeholder="Content"
                    value={post.content}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={post.image_url}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={post.category}
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit" onClick={updatePost} >
                    Update Post
                </button>
                <button type="button" onClick={deletePost}>
                    Delete Post
                </button>
            </form>
        </div>
    )
}

export default EditPost;