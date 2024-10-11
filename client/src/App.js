import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login"; // Updated import path
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTeam from "./pages/MyTeam";
import StageResults from "./pages/StageResults";
import OpenRiders from "./pages/OpenRiders";
import TeamStandings from "./pages/TeamStandings";
import { loginUser } from "./store/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(loginUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-team/:teamId"
            element={
              <ProtectedRoute>
                <MyTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <StageResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riders"
            element={
              <ProtectedRoute>
                <OpenRiders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/standings"
            element={
              <ProtectedRoute>
                <TeamStandings />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
