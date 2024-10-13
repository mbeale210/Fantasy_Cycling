import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // Import API for fetching user's team data
import { logoutUser } from "../store/slices/authSlice"; // To clear the Redux state

const Header = () => {
  const { user } = useSelector((state) => state.auth || {});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fantasyTeam, setFantasyTeam] = useState(null);

  useEffect(() => {
    const fetchUserTeam = async () => {
      if (user) {
        try {
          const response = await api.get(`/teams?user_id=${user.id}`);
          if (response.data && response.data.length > 0) {
            setFantasyTeam(response.data[0]); // Assuming only one team per user
          }
        } catch (error) {
          console.error("Failed to fetch team data", error);
        }
      }
    };

    fetchUserTeam();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout(); // Logs out in AuthContext
      dispatch(logoutUser()); // Clears the Redux user state
      setFantasyTeam(null); // Clear team data after logout
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

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
                {fantasyTeam && (
                  <Link to={`/my-team/${fantasyTeam.id}`}>My Team</Link>
                )}
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
                <button onClick={handleLogout}>Logout</button>
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
