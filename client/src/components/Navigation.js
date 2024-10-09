import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navigation = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/my-team">My Team</Link>
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
  );
};

export default Navigation;
