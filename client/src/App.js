import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTeam from "./pages/MyTeam";
import StageResults from "./pages/StageResults";
import OpenRiders from "./pages/OpenRiders";
import TeamStandings from "./pages/TeamStandings";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && !loading && !error) {
      dispatch(fetchUser())
        .unwrap()
        .then(() => setIsInitialized(true))
        .catch(() => setIsInitialized(true));
    }
  }, [dispatch, isInitialized, loading, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header>
          <Navigation />
        </Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-team/:teamId" element={<MyTeam />} />
            <Route path="/results" element={<StageResults />} />
            <Route path="/riders" element={<OpenRiders />} />
            <Route path="/standings" element={<TeamStandings />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
