import React, { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Create global context
export const Context = createContext({
  isAuthenticated: false,
  user: {},
  userRole: "",
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        userRole,
        setUserRole,
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
