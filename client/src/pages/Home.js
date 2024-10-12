import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import RiderList from "../components/RiderList";

const Home = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await api.get("/riders/rankings");
        setRiders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load riders.");
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <h1>Welcome to Fantasy Tour de France</h1>
      <p>Create your dream cycling team and compete with others!</p>
      {!user && (
        <div>
          <Link to="/register">
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
      <h2>Current Rider Rankings</h2>
      <RiderList riders={riders} />
    </div>
  );
};

export default Home;
