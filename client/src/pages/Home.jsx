import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";
import SuggestedProductGrid from "../components/suggestedProductGrid";

const Home = () => {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        setLoading(true);
        const [arrivalsRes, topSellingRes] = await Promise.all([
          getProducts({ sort: "newest", limit: 4 }),
          getProducts({ limit: 4 }),
        ]);
        setNewArrivals(arrivalsRes.products || []);
        setTopSelling(topSellingRes.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeProducts();
  }, []);

  const testimonials = [
    {
      name: "Sarah M.",
      verified: true,
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      verified: true,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      verified: true,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              FIND CLOTHES
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE
            </h1>

            <p className="hero__description">
              Browse through our diverse range of meticulously crafted
              garments, designed to bring out your individuality and cater to
              your sense of style.
            </p>

            <Link to="/products" className="hero__cta">
              Shop Now
            </Link>

            <div className="hero__stats">
              <div className="hero__stat-item">
                <span className="hero__stat-number">200+</span>
                <span className="hero__stat-label">International Brands</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat-item">
                <span className="hero__stat-number">2,000+</span>
                <span className="hero__stat-label">High-Quality Products</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat-item">
                <span className="hero__stat-number">30,000+</span>
                <span className="hero__stat-label">Happy Customers</span>
              </div>
            </div>
          </div>

          <div className="hero__media">
            <span className="hero__star hero__star--large">&#10022;</span>
            <span className="hero__star hero__star--small">&#10022;</span>
            <img
              src="/assets/images/background-images/hero-bg.png"
              alt="Fashion Models"
              className="hero__image"
            />
          </div>
        </div>
      </section>

      <section className="brands" id="brands">
        <div className="brands__container">
          <img
            src="/assets/icons/versace-icon.svg"
            alt="Versace"
            className="brands__logo"
          />
          <img
            src="/assets/icons/zara-icon.svg"
            alt="Zara"
            className="brands__logo"
          />
          <img
            src="/assets/icons/gucci-icon.svg"
            alt="Gucci"
            className="brands__logo"
          />
          <img
            src="/assets/icons/prada-icon.svg"
            alt="Prada"
            className="brands__logo"
          />
          <img
            src="/assets/icons/calvin-icon.svg"
            alt="Calvin Klein"
            className="brands__logo"
          />
        </div>
      </section>

      <section className="products-section container">
        <h2 className="products-section__title">NEW ARRIVALS</h2>
        {loading ? (
          <Loader text="Loading new arrivals..." />
        ) : (
          <SuggestedProductGrid products={newArrivals} />
        )}
        <button
          className="products-section__btn"
          onClick={() => navigate("/products?sort=newest")}
        >
          View All
        </button>

        <hr className="products-section__divider" />

        <h2 className="products-section__title">TOP SELLING</h2>
        {loading ? (
          <Loader text="Loading top selling..." />
        ) : (
          <SuggestedProductGrid products={topSelling} />
        )}
        <button
          className="products-section__btn"
          onClick={() => navigate("/products")}
        >
          View All
        </button>
      </section>

      <section className="dress-style container">
        <div className="dress-style__card">
          <h2 className="dress-style__title">BROWSE BY DRESS STYLE</h2>
          <div className="dress-style__grid">
            <div
              className="style-card style-card--small"
              onClick={() => navigate("/products?search=casual")}
            >
              <h3 className="style-card__title">Casual</h3>
              <img
                src="/assets/images/background-images/casual-1.png"
                alt="Casual"
                className="style-card__image"
              />
            </div>
            <div
              className="style-card style-card--large"
              onClick={() => navigate("/products?search=formal")}
            >
              <h3 className="style-card__title">Formal</h3>
              <img
                src="/assets/images/background-images/formal-1.png"
                alt="Formal"
                className="style-card__image"
              />
            </div>
            <div
              className="style-card style-card--large"
              onClick={() => navigate("/products?search=party")}
            >
              <h3 className="style-card__title">Party</h3>
              <img
                src="/assets/images/background-images/party-1.png"
                alt="Party"
                className="style-card__image"
              />
            </div>
            <div
              className="style-card style-card--small"
              onClick={() => navigate("/products?search=gym")}
            >
              <h3 className="style-card__title">Gym</h3>
              <img
                src="/assets/images/background-images/gym-1.png"
                alt="Gym"
                className="style-card__image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">OUR HAPPY CUSTOMERS</h2>
          <div className="testimonials__arrows">
            <button aria-label="Previous">&larr;</button>
            <button aria-label="Next">&rarr;</button>
          </div>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-card__stars">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src="/assets/icons/Star.svg"
                    alt="star"
                  />
                ))}
              </div>
              <h4 className="testimonial-card__name">
                {t.name}
                {t.verified && (
                  <img
                    src="/assets/icons/green-approve-icon.svg"
                    alt="verified"
                  />
                )}
              </h4>
              <p className="testimonial-card__text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
