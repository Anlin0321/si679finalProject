import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPostsWithAuthorNames } from "../data/posts";


function Home() {
  const [ posts, setPosts ] = useState([]);
  console.log('in Home, posts:', posts);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPostsWithAuthorNames(null);
      console.log('in Home useEffect, posts were fetched:', posts);
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      <div className="content-container">
        <div className="table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Creation Date</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><Link to={`/viewPost/${post.id}`}>{post.title}</Link></td>
                  <td>{post.authorName}</td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>{new Date(post.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;