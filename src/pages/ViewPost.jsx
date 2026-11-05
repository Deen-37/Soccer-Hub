import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
function ViewPost() {

    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([])
    // Store the user's comment
    const [newComment, setNewComment] = useState("");
    const [originalPost, setOriginalPost] = useState(null); // Original reposted post
    // Fetch original post
    const getOriginalPost = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch original post");
            }

            const data = await response.json();
            setOriginalPost(data);


        } catch (error) {
            console.error(error);
        }
    };
    const getPost = async () => {
        try {
            // Get the post from Express
            const response = await fetch(`http://localhost:3000/posts/${id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch post");
            }

            const data = await response.json();

            setPost(data);

            const commentsResponse = await fetch(
                `http://localhost:3000/posts/${id}/comments`
            );

            const commentsData = await commentsResponse.json();

            setComments(commentsData);

            // Load the original post if this is a repost
            if (data.reposted_from) {
                getOriginalPost(data.reposted_from);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getPost();
    }, []);

    if (!post) {
        return <h2>Loading...</h2>;
    }

    const upvotePost = async () => {
        try {
            // Tell Express to increase the upvote count
            const response = await fetch(`http://localhost:3000/posts/${id}/upvote`, {
                method: "PUT",
            });

            if (!response.ok) {
                throw new Error("Failed to upvote post");
            }

            // Refresh the post
            await getPost();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    // Get comments for this post

    // Add a new comment
    const addComment = async (event) => {
        event.preventDefault();

        if (!newComment.trim()) return;

        try {
            // Send the comment to Express
            const response = await fetch(
                `http://localhost:3000/posts/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: newComment,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            setNewComment("");

            // Refresh comments
            await getPost();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    // Repost current post
    const repostPost = async () => {
        try {
            // Send repost request to Express
            const response = await fetch(
                `http://localhost:3000/posts/${id}/repost`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to repost");
            }

            const data = await response.json();

            // Open the newly created repost
            navigate(`/post/${data.id}`);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // Exact timestamp shown on hover — e.g. "Aug 4, 2026, 3:45 PM"
    const formatExact = (value) =>
        new Date(value).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    // Friendly relative label shown in the meta line — e.g. "3 hours ago"
    const formatRelative = (value) => {
        const then = new Date(value);                            // the post's creation time
        const seconds = Math.floor((Date.now() - then) / 1000); // how many seconds ago

        const units = [
            ["year", 31536000],
            ["month", 2592000],
            ["day", 86400],
            ["hour", 3600],
            ["minute", 60],
        ];

        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

        for (const [unit, secondsInUnit] of units) {
            const amount = Math.floor(seconds / secondsInUnit);
            if (amount >= 1) return rtf.format(-amount, unit);
        }
        return "just now";
    };

    return (
        <div className="page">
            <article className="post-detail">
                <h1>{post.title}</h1>

                <p>{post.content}</p>

                {/* <p className="viewpost-category">{post.category}</p> */}

                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        width="300"
                    />
                )}
            </article>

            {originalPost && (
                <div className="repost-card">
                    <h3>Original Post</h3>

                    <Link to={`/post/${originalPost.id}`}>
                        <h4>{originalPost.title}</h4>
                    </Link>

                    <p>{originalPost.content}</p>
                </div>
            )}

            <div className="detail-meta">
                <p title={formatExact(post.created_at)}>
                    Posted {formatRelative(post.created_at)}
                </p>
                <p>👍 {post.upvotes}</p>
            </div>

            <div className="action-row">
                <button onClick={upvotePost}>👍</button>
                <button onClick={repostPost}>🔁</button>
                <Link to={`/edit/${post.id}`}>
                    <button>Edit</button>
                </Link>
            </div>

            <section className="comments">
                <h2> Comments 💬</h2>
                {comments.map((comment) => (
                    <p key={comment.id} className="comment">
                        ●    {comment.content}
                    </p>
                ))}
                <form className="comment-form" onSubmit={addComment}>
                    <textarea
                        type='text'
                        placeholder="Add comment ..."
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                    />
                    <button type="submit">Add</button>
                </form>
            </section>
        </div >
    );
}

export default ViewPost