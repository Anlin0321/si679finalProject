import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updatePost, createPost } from '../data/posts';

function PostEdit({ post, currentUser }) {

  const navigate = useNavigate();
  if (!currentUser) navigate('/');
  if (!post) {
    post = {
      title: '',
      content: '',
      authorId: currentUser.id,
      authorName: currentUser.displayName
    }
  }
  const [workingPost, setWorkingPost] = useState(post);

  if (!workingPost) {
    return <div>Loading...</div>;
  }
  return (
    <div className="post-complete">
      <p><strong>Title:</strong></p>
      <p><input type="text" value={workingPost.title} onChange={(e) => {
        setWorkingPost({ ...workingPost, title: e.target.value });
      }} /></p>
      <p><strong>Body:</strong></p>
      <p><textarea value={workingPost.content} onChange={(e) => {
        setWorkingPost({ ...workingPost, content: e.target.value });
      }} /></p>
      <div className="post-meta">
        <p><strong>Author:</strong> {workingPost.authorName || 'Unknown Author'}</p>
        {workingPost.id ? 
          (
            <span>
              <p><strong>Created:</strong> {workingPost.createdAt}</p>
              <p><strong>Last Updated:</strong> {workingPost.updatedAt}</p>
            </span>
          ) :
          <span/>
        }
      </div>
      <button className="tasty-button small-button" onClick={async () => {
        delete workingPost.authorName;
        if (workingPost.id) {
          await updatePost(workingPost.id, workingPost);
        } else {
          await createPost(workingPost);
        }
        navigate('/managePosts');

      }}>Save</button>
      <button className="tasty-button small-button" onClick={() => {
        navigate('/managePosts');
      }}>Cancel</button>
    </div>
  );
}

export default PostEdit;