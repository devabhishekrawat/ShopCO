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
    <div className="container error-page">
      <h1 className="error-page__title">{title}</h1>
      <p className="error-page__message">{message}</p>
      <Link
        to="/"
        className="error-page__btn"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;

