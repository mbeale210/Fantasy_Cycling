import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home">
      <h1>Welcome to Fantasy Tour de France</h1>
      <p>Create your dream cycling team and compete with others!</p>
      {!isAuthenticated ? (
        <div>
          <Link to="/register">
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      ) : (
        <Link to="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      )}
    </div>
  );
};

export default Home;
