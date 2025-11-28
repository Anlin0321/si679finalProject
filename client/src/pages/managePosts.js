import { useNavigate } from "react-router-dom";
import { FaTrashCan, FaPencil } from "react-icons/fa6";
import { useContext, useState, useEffect } from "react";

import { getPostsWithAuthorNames, deletePost } from "../data/posts";
import { CurrentUserContext } from "../App";

function ManagePosts() {
  const navigate = useNavigate();
  const [ posts, setPosts ] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  console.log(currentUser)

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPostsWithAuthorNames(currentUser.id);
      setPosts(posts);
    };
    
    if (!currentUser) {
      navigate('/'); 
      return;
    }
    fetchPosts();
  }, [currentUser]);

  if (!currentUser) {
    return ( <div />)
  }


  return (
    <div>
      <h1>{currentUser.displayName}'s Posts</h1>
      <div className="content-container">
        <div className="table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Creation Date</th>
                <th>Last Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.authorName}</td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>{new Date(post.updatedAt).toLocaleString()}</td>
                  <td className="button-cell">
                    <FaPencil onClick={() => {
                      navigate(`/editPost/${post.id}`);
                    }} />
                    <FaTrashCan onClick={async () => {
                      await deletePost(post.id);
                      const updatedPosts = await getPostsWithAuthorNames(currentUser.id);
                      setPosts(updatedPosts);
                    }} />

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        <button className="tasty-button" onClick={() => {
          navigate('/editPost');
        }}>New Post</button>

      </div>
    </div>
  );
}

export default ManagePosts;
