import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../client";
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
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return;

        setOriginalPost(data);
    }
    const getPost = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .select("*")
            .eq("id", id)
            .single();  // returns in dictionary format. other wise this return an array
        // Get comments for this post
        const { data: commentsData, error: commentsError } = await supabase
            .from("Comments")
            .select("*")
            .eq("post_id", id)
            .order("created_at", { ascending: true });

        if (!commentsError) {
            setComments(commentsData);
        }
        if (error) {
            alert(error);
            return;
        }

        setPost(data);
        if (data.reposted_from) {
            getOriginalPost(data.reposted_from);
        }
    }

    useEffect(() => {
        getPost();
    }, []);

    if (!post) {
        return <h2>Loading...</h2>;
    }

    const upvotePost = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .update({ upvotes: post.upvotes + 1 })
            .eq("id", id)
        if (error) {
            alert(error);
            return;
        }

        await getPost();

    }
    // Get comments for this post

    // Add a new comment
    const addComment = async () => {
        event.preventDefault();          // stop the page reload

        if (!newComment.trim()) return;  // don't insert empty comments
        const { error } = await supabase
            .from("Comments")
            .insert({
                content: newComment,
                post_id: id,
            });
        console.log(error)
        if (!error) {
            setNewComment(""); // Clear input
            getPost(); // Refresh comments
        }
        else {
            console.log(error)
        }
    };
    // Repost current post
    const repostPost = async () => {
        const newSecretKey = prompt("Enter a secret key for your repost:");

        if (!newSecretKey) {
            alert("Secret key is required.");
            return;
        }
        const { data, error } = await supabase
            .from("Posts")
            .insert([{
                title: post.title,
                content: post.content,
                image_url: post.image_url,
                category: post.category,
                flag: post.flag,          // Copy flag/category if you use it
                secret_key: newSecretKey,
                reposted_from: post.id,
            }])
            .select()
            .single();

        if (error) {
            alert(error.message);
            return;
        }

        navigate(`/post/${data.id}`);
    }

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