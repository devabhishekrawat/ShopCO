import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err || "Invalid credentials");
    }
  };

  return (
    <main className="login">
      <div className="login__container">
        <div className="login__content">
          <div className="login__brand">SHOP.CO</div>

          <div className="login__header">
            <h1 className="login__title">WELCOME BACK</h1>
            <p className="login__description">
              Sign in to your account and continue shopping your favorite styles.
            </p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label htmlFor="email" className="login__label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="login__input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login__field">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="password" className="login__label">
                  Password
                </label>
              </div>
              <input
                type="password"
                id="password"
                className="login__input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login__error">{error}</p>}

            <button
              type="submit"
              className="login__button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="login__signup">
            Don't have an account?{" "}
            <Link to="/signup" className="login__signup-link">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="login__visual">
          <div className="login__visual-content">
            <span className="login__star login__star--large">✦</span>
            <h2 className="login__visual-title">
              FIND YOUR
              <br />
              PERFECT STYLE
            </h2>
            <p className="login__visual-description">
              Discover clothes that match your personality and make you feel confident.
            </p>
            <span className="login__star login__star--small">✦</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
