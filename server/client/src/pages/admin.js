import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashCan, FaPencil } from "react-icons/fa6";

import { CurrentUserContext } from "../App";
import { getUsers, deleteUser, createUser } from "../data/users";

function Admin() {
  const {currentUser} = useContext(CurrentUserContext);
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
    const fetchUsers = async () => {
      const users = await getUsers();
      console.log('in Admin useEffect, users were fetched:', users);
      setUsers(users);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>

      <h2>Users</h2>
      <div className="content-container">
        <div className="table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Display Name</th>
                <th>ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.displayName}</td>
                  <td>{user.id}</td>
                  <td className="button-cell">
                    <FaPencil onClick={() => {
                      navigate(`/editUser/${user.id}`);
                    }} />
                    <FaTrashCan onClick={async () => {
                      await deleteUser(user.id);
                      const updatedUsers = await getUsers();
                      setUsers(updatedUsers);
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="login-form">
          <label htmlFor="username">New Username</label>
          <input 
            type="text" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)} 
            required
          />
            <label htmlFor="password">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <label htmlFor="displayName">New Display Name</label>
            <input 
              type="text" 
              value={newDisplayName} 
              onChange={(e) => setNewDisplayName(e.target.value)} 
              required 
            />
          <button onClick={async () => {
            await createUser(newUsername, newPassword, newDisplayName);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setNewUsername('');
            setNewPassword('');
            setNewDisplayName('');
          }}>Create User</button>
      </div>
      </div>
    </div>
  );
}

export default Admin;