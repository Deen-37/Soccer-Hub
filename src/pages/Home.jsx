import { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
function Home() {
    // Store all posts
    const [posts, setPosts] = useState([]);

    // Fetch posts when the page loads
    useEffect(() => {
        getPosts();
    }, []);

    // Get all posts from Supabase
    const getPosts = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setPosts(data);
    };

    return (

        <div>
            <h1>⚽ Soccer Hub</h1>

            {posts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id}>
                    <div>
                        <h2>{post.title}</h2>

                        <p>{post.content}</p>

                        <p>Category: {post.category}</p>

                        {post.image_url && (
                            <img
                                src={post.image_url}
                                alt={post.title}
                                width="300"
                            />
                        )}
                    </div>
                </Link>

            ))}
        </div>
    );
}

export default Home;