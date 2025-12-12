import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPostWithAuthorName } from "../data/posts";
import PostEdit from "../components/PostEdit";

import { CurrentUserContext } from "../App";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  const [ post, setPost ] = useState(null);

  if (!currentUser) navigate('/');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostWithAuthorName(id);
        setPost(post);
      } catch (error) {
        navigate('/error', { state: { errorMessage: error.message }});
      }
    };
    if (id) {
      fetchPost();
    }
  }, [id]);

  if (id && !post) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Edit Post</h1>
      <PostEdit post={post} currentUser={currentUser} />  
    </div>
  );
}

export default EditPost;