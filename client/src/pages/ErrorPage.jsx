import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "404";
  let message = "Page not found.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status}`;
    message = error.status === 404 ? "Page not found." : (error.statusText || error.data?.message || "An error occurred.");
  } else if (error instanceof Error) {
    title = "Oops!";
    message = error.message;
  }

  return (
    <div className="container" style={{ padding: "5rem 1rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Integral CF", fontSize: "3rem" }}>{title}</h1>
      <p style={{ marginTop: "1rem", color: "#666", fontSize: "1.1rem" }}>{message}</p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "1.5rem",
          padding: "0.75rem 1.75rem",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "62px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;

