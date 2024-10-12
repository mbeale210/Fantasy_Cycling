import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTeam from "./pages/MyTeam";
import StageResults from "./pages/StageResults";
import OpenRiders from "./pages/OpenRiders";
import TeamStandings from "./pages/TeamStandings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
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
    </AuthProvider>
  );
}

export default App;
