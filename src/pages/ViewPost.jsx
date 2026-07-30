import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
function ViewPost() {

    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [comments, setComments] = useState([])
    // Store the user's comment
    const [newComment, setNewComment] = useState("");
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
    return (
        <div>
            <h1>{post.title}</h1>

            <p>{post.content}</p>

            <p>Category: {post.category}</p>

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt={post.title}
                    width="300"
                />
            )}

            <p>Posted at: {Date(post.created_at)}</p>
            <p>Upvotes: {post.upvotes}</p>


            <Link to={`/edit/${post.id}`}>
                <button> Edit Post </button>
            </Link>
            <button onClick={upvotePost}>Upvote ↑ </button>

            <h2> </h2>
            <form onSubmit={addComment}>
                <textarea
                    type='text'
                    placeholder="Add comment ..."
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                />
                <button type="submit" > Add </button>
            </form>
            {comments.map((comment) => (
                <p key={comment.id}>
                    {comment.content}
                </p>
            ))}
        </div >
    );
}

export default ViewPost