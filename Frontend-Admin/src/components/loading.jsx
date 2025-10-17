import React from "react";
import "../App.css";

const Loading = () => {
  return (
    <div className="loading-overlay">
      <img
        src="/loading.gif"
        alt="Loading..."
        className="loading-gif"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-loading.gif"; // fallback if gif not found
        }}
      />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
