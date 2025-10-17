import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Create a simple context if needed (optional)
export const Context = createContext({});

const AppWrapper = () => {
  return (
    <Context.Provider value={{}}>
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
