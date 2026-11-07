import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { formatExact, formatRelative } from "../utils/formatDate";
import { CATEGORIES, FLAGS } from "../constants";
import { getPosts as fetchPosts } from "../api/posts";
function Home() {
    //store search term
    const [searchTerm, setSearchTerm] = useState("");
    // Store all posts
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("upvotes");
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedCategory, setSelectedCategory] = useState("All"); // Current category
    const [selectedFlag, setSelectedFlag] = useState("All"); // Current flag filter
    // Fetch posts when the page loads
    useEffect(() => {
        // Get all posts from our Express API
        const getPosts = async () => {
            try {
                // request() throws if the API request failed
                const data = await fetchPosts();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    }, []);

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
            <div className="toolbar">
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
            </div>
            <div className="category-buttons">
                <button onClick={() => setSelectedCategory("All")}>All</button>
                {CATEGORIES.map((category) => (
                    <button key={category} onClick={() => setSelectedCategory(category)}>
                        {category}
                    </button>
                ))}
            </div>
            <div className="flag-buttons">
                <button onClick={() => setSelectedFlag("All")}>All Flags</button>
                {FLAGS.map((flag) => (
                    <button key={flag} onClick={() => setSelectedFlag(flag)}>
                        {flag}
                    </button>
                ))}
            </div>
            <div className="feed">
                {posts.filter((post) => {
                    const matchesSearch = post.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                    const matchesCategory =
                        selectedCategory === "All" ||
                        post.category === selectedCategory;

                    const matchesFlag =
                        selectedFlag === "All" ||
                        post.flag === selectedFlag;

                    return matchesSearch && matchesCategory && matchesFlag;
                }).sort((a, b) => { // takes care of the sorting
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
                        <Link to={`/post/${post.id}`} key={post.id} className="post-card">
                            <div>
                                <h2>{post.title}</h2>
                                <p>👍 {post.upvotes}</p>
                                {/* Visible text is relative ("3 hours ago"); hovering shows the exact time */}
                                <p title={formatExact(post.created_at)}>
                                    Posted {formatRelative(post.created_at)}
                                </p>

                                {/* Category in the lower-right — plain red text, no pill */}
                                {post.category && (
                                    <span className="card-category">{post.category}</span>
                                )}

                                {/* Flag emoji in the top-right — 💬 for Opinion, ❔ otherwise */}
                                {post.flag && (
                                    <span className="card-flag">
                                        {post.flag === "Opinion" ? "💬" : "❔"}
                                    </span>
                                )}
                            </div>
                        </Link>



                    ))}
            </div>
        </div>
    );
}

export default Home;