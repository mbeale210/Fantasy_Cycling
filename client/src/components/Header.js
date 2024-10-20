import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useSelector((state) => state.auth || {});
  const { logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                {/* Dynamically link to the user's specific team page */}
                <Link to={`/my-team/${user.id}`}>My Team</Link>
              </li>
              <li>
                <Link to="/results">Stage Results</Link>
              </li>
              <li>
                <Link to="/riders">Open Riders</Link>
              </li>
              <li>
                <Link to="/standings">Team Standings</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
