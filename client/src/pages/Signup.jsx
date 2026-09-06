import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in name, email and password");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim() || undefined,
      address: formData.street
        ? {
            street: formData.street.trim(),
            city: formData.city.trim(),
          }
        : undefined,
    };

    try {
      await dispatch(signupUser(payload)).unwrap();
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Signup failed");
    }
  };

  return (
    <main className="login">
      <div className="login__container">
        <div className="login__content">
          <div className="login__brand">SHOP.CO</div>

          <div className="login__header">
            <h1 className="login__title">CREATE AN ACCOUNT</h1>
            <p className="login__description">
              Join SHOP.CO today to discover tailored recommendations and deals.
            </p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label htmlFor="name" className="login__label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="login__input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login__field">
              <label htmlFor="email" className="login__label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="login__input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login__field">
              <label htmlFor="password" className="login__label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="login__input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login__field">
              <label htmlFor="phone" className="login__label">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="login__input"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {error && <p className="login__error">{error}</p>}

            <button
              type="submit"
              className="login__button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="login__signup">
            Already have an account?{" "}
            <Link to="/login" className="login__signup-link">
              Sign In
            </Link>
          </p>
        </div>

        <div className="login__visual">
          <div className="login__visual-content">
            <span className="login__star login__star--large">✦</span>
            <h2 className="login__visual-title">
              JOIN THE
              <br />
              COMMUNITY
            </h2>
            <p className="login__visual-description">
              Sign up today and get 20% off your very first order with coupon WELCOME10.
            </p>
            <span className="login__star login__star--small">✦</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
