import { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
function Home() {
    //store search term
    const [searchTerm, setSearchTerm] = useState("");
    // Store all posts
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("upvotes");
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch posts when the page loads
    useEffect(() => {
        getPosts();
    }, []);

    // Get all posts from Supabase
    const getPosts = async () => {
        setLoading(true); // Start loading
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setPosts(data);
        setLoading(false); // Finished loading
    };
    if (loading) {
        return (
            <div className="loading-container">
                <ClipLoader size={50} />
                <p>Loading posts...</p>
            </div>
        );
    }
    return (

        <div>
            <h1>⚽ Soccer Hub</h1>
            <input
                type="text"
                placeholder="Search posts ..."
                value={searchTerm} // current search term
                onChange={(event) => setSearchTerm(event.target.value)}  // update the state, searchTerm, when the user types
            />

            <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
            >
                <option value="upvotes" >Most Upvoted</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
            {posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase())) // filters before display
                .sort((a, b) => { // takes care of the sorting
                    if (sortBy === "upvotes") {
                        return b.upvotes - a.upvotes
                    }
                    if (sortBy === "newest") {
                        return new Date(b.created_at) - new Date(a.created_at)
                    }
                    if (sortBy === "oldest") {
                        return new Date(a.created_at) - new Date(b.created_at)
                    }
                    return 0;
                })
                .map((post) => (    // tellin
                    <Link to={`/post/${post.id}`} key={post.id}>
                        <div>
                            <h2>{post.title}</h2>
                            <p> Upvotes: {post.upvotes}</p>
                            <p>Posted at: {Date(post.created_at)}</p>

                        </div>
                    </Link>



                ))}
        </div>
    );
}

export default Home;