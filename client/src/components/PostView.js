
function PostView({ post }) {

  return (
    <div className="post-complete">
      <h1>{post.title}</h1>
      <p>{post.message}</p>
      <div className="post-meta">
        <p><strong>Author:</strong> {post.authorName || 'Unknown Author'}</p>
        <p><strong>price:</strong> {post.price}</p>
        <p><strong>status:</strong> {post.availabilityStatus}</p>
      </div>
    </div>
  );
}

export default PostView;