import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, loginUser, logoutUser } from "../store/slices/authSlice";
import api from "../services/api"; // Import the API to call logout

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchUser()); // Fetch user only if token is available
    }
  }, [dispatch, user]);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Ensure the server's logout route is called
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      dispatch(logoutUser()); // Clear Redux state
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
