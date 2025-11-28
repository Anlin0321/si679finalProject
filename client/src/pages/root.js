import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";

import '../index.css';
import { CurrentUserContext } from "../App";

function Root() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-left">
          <Link to="/">Blogtastic</Link>
        </div>
        <div className="App-header-right">
          {currentUser && 
            <>
              <NavLink to="/managePosts" 
                className={
                  ({ isActive }) => 
                    isActive ? 
                    "active-nav-link" : 
                    ""}>
                Manage Posts
              </NavLink>
              <NavLink to="/admin" className={({ isActive }) => isActive ? "active-nav-link" : ""}>Admin</NavLink>
              <span onClick={() => {
                setCurrentUser(null);
                navigate("/?logout=true");
              }}>Logout</span>
            </>
          }
          {!currentUser && <Link to="/login">Login</Link>}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Root;
