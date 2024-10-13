import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);

  const validateInput = () => {
    if (!email.includes("@")) {
      return "Invalid email format. Email must contain '@'.";
    }
    if (password.length < 6 || !/\d/.test(password)) {
      return "Password must be at least 6 characters long and contain at least one number.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setClientError(validationError);
      return;
    }
    setClientError("");
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      navigate("/login");
    } catch (err) {
      // Error is handled in the Redux store
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {clientError && <p className="error">{clientError}</p>}
      {authError && <p className="error">{authError.message}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
