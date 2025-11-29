import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updatePost, createPost } from '../data/posts';

function PostEdit({ post, currentUser }) {

  const navigate = useNavigate();
  if (!currentUser) navigate('/');
  if (!post) {
    post = {
      title: '',
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
      <p><strong>Price:</strong></p>
      <p>$<input type="number" value={workingPost.price} onChange={(e) => {
        setWorkingPost({ ...workingPost, price: e.target.value });
      }} /></p>
      <p><strong>Shipment:</strong></p>
      <p><input type="text" value={workingPost.shipment} onChange={(e) => {
        setWorkingPost({ ...workingPost, shipment: e.target.value });
      }} /></p>
      <p><strong>Condition:</strong></p>
      <p>
        <select
          value={workingPost.condition}
          onChange={(e) =>
            setWorkingPost({
              ...workingPost,
              condition: e.target.value,
            })
          }
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="new">DS</option>
          <option value="like_new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>

        </select>
      </p>
      <p><strong>Age:</strong></p>
      <p><input type="number" value={workingPost.age} onChange={(e) => {
        setWorkingPost({ ...workingPost, age: e.target.value });
      }} /> Years</p>
      <p><strong>Status:</strong></p>
      <p>
        <select
          value={workingPost.availabilityStatus}
          onChange={(e) =>
            setWorkingPost({
              ...workingPost,
              availabilityStatus: e.target.value,
            })
          }
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
          <option value="removed">Removed</option>
        </select>
      </p>


      <p><strong>Message:</strong></p>
      <p><textarea value={workingPost.message} onChange={(e) => {
        setWorkingPost({ ...workingPost, message: e.target.value });
      }} /></p>
      <div className="post-meta">
        <p><strong>Author:</strong> {currentUser.displayName || 'Unknown Author'}</p>

      </div>
      <button className="tasty-button small-button" onClick={async () => {
        delete workingPost.authorName;
        if (workingPost.id) {
          await updatePost(workingPost.id, workingPost, currentUser);
        } else {
          await createPost(workingPost, currentUser);
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