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
    const [selectedCategory, setSelectedCategory] = useState("All"); // Current category
    const [selectedFlag, setSelectedFlag] = useState("All"); // Current flag filter
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

    // Exact timestamp, shown on hover as a tooltip — e.g. "Aug 2, 2026, 3:45 PM"
    const formatExact = (value) =>
        new Date(value).toLocaleString(undefined, {   // read the stored creation time
            month: "short",    // "Aug"
            day: "numeric",    // "2"
            year: "numeric",   // "2026"
            hour: "numeric",   // "3"
            minute: "2-digit", // "45"
        });

    // Friendly relative label, shown on the card — e.g. "3 hours ago"
    const formatRelative = (value) => {
        const then = new Date(value);                            // the post's creation time
        const seconds = Math.floor((Date.now() - then) / 1000); // how many seconds ago that was

        // units from largest to smallest, with how many seconds each one holds
        const units = [
            ["year", 31536000],  // 365 days
            ["month", 2592000],  // 30 days
            ["day", 86400],      // 24 hours
            ["hour", 3600],      // 60 minutes
            ["minute", 60],      // 60 seconds
        ];

        // Intl formatter that turns (-3, "hour") into the text "3 hours ago"
        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

        // walk from the biggest unit down; use the first one that fits at least once
        for (const [unit, secondsInUnit] of units) {
            const amount = Math.floor(seconds / secondsInUnit); // how many of this unit have passed
            if (amount >= 1) return rtf.format(-amount, unit);  // negative = in the past -> "... ago"
        }
        return "just now"; // under a minute old
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
                <button onClick={() => setSelectedCategory("News")}>News</button>
                <button onClick={() => setSelectedCategory("Transfer")}>Transfer</button>
                <button onClick={() => setSelectedCategory("Match")}>Match</button>
                <button onClick={() => setSelectedCategory("Discussion")}>Discussion</button>
                <button onClick={() => setSelectedCategory("Other")}>Other</button>
            </div>
            <div className="flag-buttons">
                <button onClick={() => setSelectedFlag("All")}>All Flags</button>
                <button onClick={() => setSelectedFlag("Question")}>Question</button>
                <button onClick={() => setSelectedFlag("Opinion")}>Opinion</button>
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