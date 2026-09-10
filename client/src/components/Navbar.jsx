import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";

const Navbar = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debounceTimer = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const totalCartCount = cart?.products?.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) || 0;

  useEffect(() => {
    if (location.pathname === "/products") {
      const searchParam = new URLSearchParams(location.search).get("search") || "";
      setSearchInput(searchParam);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const trimmed = val.trim();
      if (trimmed) {
        navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      } else if (location.pathname === "/products") {
        navigate("/products");
      }
    }, 450);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      setMenuOpen(false);
    } else if (location.pathname === "/products") {
      navigate("/products");
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      setDropdownOpen(false);
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {showBanner && !isAuthenticated && (
        <div className="top-banner">
          <p className="top-banner__text">
            Sign up and get 20% off to your first order.
            <Link to="/signup" className="top-banner__link">
              Sign Up Now
            </Link>
          </p>
          <button
            className="top-banner__close"
            onClick={() => setShowBanner(false)}
          >
            &times;
          </button>
        </div>
      )}

      <header className="header">
        <div className="header__container">
          <button
            className="header__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src="/assets/icons/humburger.svg"
              alt="Menu"
              className="header__hamburger-icon"
            />
          </button>

          <Link to="/" className="header__logo">
            SHOP.CO
          </Link>

          <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
            <ul className="header__menu">
              <li className="header__menu-item">
                <Link
                  to="/products"
                  className="header__link"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop
                </Link>
              </li>
              <li className="header__menu-item">
                <Link
                  to="/categories"
                  className="header__link"
                  onClick={() => setMenuOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li className="header__menu-item">
                <Link
                  to="/products?sort=newest"
                  className="header__link"
                  onClick={() => setMenuOpen(false)}
                >
                  New Arrivals
                </Link>
              </li>
              <li className="header__menu-item">
                <Link
                  to="/products?availability=true"
                  className="header__link"
                  onClick={() => setMenuOpen(false)}
                >
                  In Stock
                </Link>
              </li>
            </ul>
          </nav>

          <form onSubmit={handleSearchSubmit} className="header__search">
            <span className="header__search-icon">
              <img
                src="/assets/icons/search-icon.svg"
                alt="search"
                className="header__search-icon-image"
              />
            </span>
            <input
              type="text"
              className="header__search-input"
              placeholder="Search for products..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </form>

          <div className="header__actions">
            <Link to="/cart" className="header__action-btn" aria-label="Cart">
              <img
                src="/assets/icons/cart-icon.svg"
                alt="cart"
                className="header__action-icon"
              />
              {totalCartCount > 0 && (
                <span className="cart-count">{totalCartCount}</span>
              )}
            </Link>

            <div
              className="header__profile"
              onMouseEnter={() => {
                if (isAuthenticated) setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setDropdownOpen(false);
              }}
            >
              <button
                className="header__action-btn"
                aria-label="Account"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                  } else {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }
                }}
              >
                <img
                  src="/assets/icons/user-icon.svg"
                  alt="user"
                  className="header__action-icon"
                />
              </button>

              {isAuthenticated && dropdownOpen && (
                <div className="header__profile-dropdown">
                  <div className="header__user-badge">
                    {user?.name || "User"}
                  </div>
                  <Link
                    to="/profile"
                    className="header__profile-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="header__profile-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="header__profile-link header__profile-link--admin"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="header__logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
