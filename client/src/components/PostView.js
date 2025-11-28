
function PostView({ post }) {

  return (
    <div className="post-complete">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div className="post-meta">
        <p><strong>Author:</strong> {post.authorName || 'Unknown Author'}</p>
        <p><strong>Created:</strong> {post.createdAt}</p>
        <p><strong>Updated:</strong> {post.updatedAt}</p>
      </div>
    </div>
  );
}

export default PostView;