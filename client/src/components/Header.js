import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const Header = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header>
      {children}
      {isAuthenticated && user && (
        <div>
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
