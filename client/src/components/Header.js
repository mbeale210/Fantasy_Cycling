import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { logoutUser } from "../store/slices/authSlice";

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
            setFantasyTeam(response.data[0]);
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
      await logout();
      dispatch(logoutUser());
      setFantasyTeam(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="main-header">
      <nav className="main-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                {fantasyTeam && (
                  <Link to={`/my-team/${fantasyTeam.id}`}>My Team</Link>
                )}
              </li>
              <li className="nav-item">
                <Link to="/results">Stage Results</Link>
              </li>
              <li className="nav-item">
                <Link to="/riders">Open Riders</Link>
              </li>
              <li className="nav-item">
                <Link to="/standings">Team Standings</Link>
              </li>
              <li className="nav-item">
                <button className="btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login">Login</Link>
              </li>
              <li className="nav-item">
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
