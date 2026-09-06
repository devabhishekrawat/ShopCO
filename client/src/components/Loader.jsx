import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ color: "#666", fontSize: "0.95rem" }}>{text}</p>
    </div>
  );
};

export default Loader;
