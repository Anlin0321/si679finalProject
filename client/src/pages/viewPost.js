import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PostView from "../components/PostView";
import { getPostWithAuthorName } from "../data/posts";

function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostWithAuthorName(id);
        setPost(post);
      } catch (error) {
        navigate('/error', { state: { errorMessage: error.message }});
      }
    };
    
    fetchPost();
  
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <PostView post={post} />
    </div>
  );
}

export default ViewPost;