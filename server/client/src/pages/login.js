import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { CurrentUserContext } from "../App";
import { validateLogin } from "../data/users";

function Login() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="content-container">
      <h1>Login</h1>
      <p className="error-message">{errorMessage}</p>
      <div className="login-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={async () => {
          try {
            const user = await validateLogin(username, password);
            if (user) {
              setCurrentUser(user);
              navigate("/managePosts");
            }
            else {
              setErrorMessage("Error validating login.");
            }
          } catch (error) {
            setErrorMessage(error.message);
          }
        }}>Login</button>
      </div>
    </div>
  );
}

export default Login;
