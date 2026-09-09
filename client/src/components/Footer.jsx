import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail || !newsletterEmail.trim() || !emailRegex.test(newsletterEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to our newsletter!");
    setNewsletterEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="newsletter-card">
          <h2 className="newsletter-card__title">
            STAY UPTO DATE ABOUT
            <br />
            OUR LATEST OFFERS
          </h2>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-card__form">
            <div className="newsletter-card__input-wrapper">
              <img
                src="/assets/icons/mail-icon.svg"
                alt="Mail"
                className="input-icon"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-card__input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="newsletter-card__btn">
              Subscribe to Newsletter
            </button>
          </form>
        </div>

        <div className="footer__main">
          <div className="footer__brand">
            <h3 className="footer__logo">SHOP.CO</h3>
            <p className="footer__desc">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="footer__socials">
              <a href="#" className="social-link" aria-label="Twitter">
                <img
                  src="/assets/icons/twitter-icon.svg"
                  alt="Twitter"
                  className="social-icon"
                />
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <img
                  src="/assets/icons/facebook-icon.svg"
                  alt="Facebook"
                  className="social-icon"
                />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <img
                  src="/assets/icons/instagram-icon.svg"
                  alt="Instagram"
                  className="social-icon"
                />
              </a>
              <a href="#" className="social-link" aria-label="Github">
                <img
                  src="/assets/icons/github-icon.svg"
                  alt="Github"
                  className="social-icon"
                />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer__col-title">COMPANY</h4>
            <ul className="footer__links">
              <li><Link to="/#">About</Link></li>
              <li><Link to="/#">Features</Link></li>
              <li><Link to="/#">Works</Link></li>
              <li><Link to="/#">Career</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__col-title">HELP</h4>
            <ul className="footer__links">
              <li><Link to="/#">Customer Support</Link></li>
              <li><Link to="/#">Delivery Details</Link></li>
              <li><Link to="/#">Terms & Conditions</Link></li>
              <li><Link to="/#">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__col-title">FAQ</h4>
            <ul className="footer__links">
              <li><Link to="/profile">Account</Link></li>
              <li><Link to="/orders">Manage Deliveries</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/#">Payments</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__col-title">RESOURCES</h4>
            <ul className="footer__links">
              <li><Link to="/#">Free eBooks</Link></li>
              <li><Link to="/#">Development Tutorial</Link></li>
              <li><Link to="/#">How to - Blog</Link></li>
              <li><Link to="/#">Youtube Playlist</Link></li>
            </ul>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copyright">
            Shop.co © 2000-2026, All Rights Reserved
          </p>
          <div className="footer__payments">
            <div className="payment-badge">
              <img
                src="/assets/icons/visa-icon.svg"
                alt="Visa"
                className="payment-icon"
              />
            </div>
            <div className="payment-badge">
              <img
                src="/assets/icons/mastercard-icon.svg"
                alt="Mastercard"
                className="payment-icon"
              />
            </div>
            <div className="payment-badge">
              <img
                src="/assets/icons/paypal-icon.svg"
                alt="Paypal"
                className="payment-icon"
              />
            </div>
            <div className="payment-badge">
              <img
                src="/assets/icons/apple-pay-icon.svg"
                alt="Apple Pay"
                className="payment-icon"
              />
            </div>
            <div className="payment-badge">
              <img
                src="/assets/icons/google-pay-icon.svg"
                alt="Google Pay"
                className="payment-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
