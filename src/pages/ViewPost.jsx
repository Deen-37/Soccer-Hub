import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
function ViewPost() {

    const [post, setPost] = useState(null);
    const { id } = useParams();

    const getPost = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .eq("id", id)
            .single();  // returns in dictionary format. other wise this return an array
        if (error) {
            alert(error);
            return;
        }

        setPost(data);
    }

    useEffect(() => {
        getPost();
    }, []);
    if (!post) {
        return <h2>Loading...</h2>;
    }
    return (
        <div>
            <h1>{post.title}</h1>

            <p>{post.content}</p>

            <p>Category: {post.category}</p>

            <p>Upvotes: {post.upvotes}</p>

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt={post.title}
                    width="300"
                />
            )}
            <Link to={`/edit/${post.id}`}>
                <button> Edit Post </button>
            </Link>
        </div>
    );
}

export default ViewPost