import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { formatExact, formatRelative } from "../utils/formatDate";
import * as postsApi from "../api/posts";
import * as commentsApi from "../api/comments";
function ViewPost() {

    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([])
    // Store the user's comment
    const [newComment, setNewComment] = useState("");
    const [originalPost, setOriginalPost] = useState(null); // Original reposted post
    // Load the post, its comments, and the original post (for reposts)
    // Runs when the page opens and again whenever the id in the URL changes
    useEffect(() => {
        const getPost = async () => {
            try {
                // Get the post from Express
                const data = await postsApi.getPost(id);
                setPost(data);

                const commentsData = await commentsApi.getComments(id);
                setComments(commentsData);

                // Load the original post if this is a repost
                if (data.reposted_from) {
                    try {
                        setOriginalPost(await postsApi.getPost(data.reposted_from));
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    setOriginalPost(null);
                }
            } catch (error) {
                alert(error.message);
            }
        };

        getPost();
    }, [id]);

    if (!post) {
        return <h2>Loading...</h2>;
    }

    const upvotePost = async () => {
        try {
            // Tell Express to increase the upvote count
            // The server sends back the updated post, so no need to reload
            const updatedPost = await postsApi.upvotePost(id);
            setPost(updatedPost);

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
            // The server sends back the new comment; add it to the end of the list
            const createdComment = await commentsApi.addComment(id, newComment);
            setComments((prevComments) => [...prevComments, createdComment]);

            setNewComment("");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    // Repost current post
    const repostPost = async () => {
        try {
            // Send repost request to Express
            const data = await postsApi.repostPost(id);

            // Open the newly created repost
            navigate(`/post/${data.id}`);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
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