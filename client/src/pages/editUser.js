import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CurrentUserContext } from "../App";
import { getUserById, updateUser } from "../data/users";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ user, setUser ] = useState(null);
  const [ newPassword, setNewPassword ] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        setUser(user);
      } catch (error) {
        navigate('/error', { state: { errorMessage: error.message }});
      }
    };
    if (!currentUser) {
      navigate('/');
    }
    if (id) {
      fetchUser();
    } else {
      throw new Error(`Cannot edit unknown user with id ${id}`);
    }
  }, [id]);

  if (id && !user) {
    return <div>Loading...</div>;
  }
  return (
   <div className="post-complete">
      <p>
        <strong>Username:</strong>
        <input type="text" value={user.username} onChange={(e) => {
          setUser({ ...user, username: e.target.value });
        }} />
      </p>
      <p>
        <strong>New Password:</strong>
        <input type="text" value={newPassword} onChange={(e) => {
          setNewPassword(e.target.value);
        }} />
      </p>
      <p>
        <strong>Display Name:</strong>
        <input type="text" value={user.displayName} onChange={(e) => {
          setUser({...user, displayName: e.target.value});
        }} />
      </p>

      <button className="tasty-button small-button" onClick={async () => {
        await updateUser(user.id, {...user, password: newPassword});
        navigate('/admin');
      }}>Save</button>
      <button className="tasty-button small-button" onClick={() => {
        navigate('/managePosts');
      }}>Cancel</button>
    </div>
  );
}

export default EditUser;