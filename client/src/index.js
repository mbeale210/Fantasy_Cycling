import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";

// Initialize the root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in the Redux Provider
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);