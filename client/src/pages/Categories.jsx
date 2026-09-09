import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice.js";
import Loader from "../components/Loader.jsx";
// import { getAssetUrl } from "../services/api.js";

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="categories-page container">
      <h1 className="categories-page__title">CATEGORIES</h1>

      {loading ? (
        <Loader text="Loading categories..." />
      ) : error ? (
        <div className="categories-page__error">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="categories-page__empty">
          No categories found.
        </div>
      ) : (
        <div className="categories-page__grid">
          {categories.map((cat) => {
            const catImage = cat.image
              // ? getAssetUrl(cat.image)
              // : "/assets/images/background-images/casual-1.png";

            return (
              <div
                key={cat._id}
                className="categories-page__card"
                onClick={() => handleCategoryClick(cat._id)}
              >
                <img
                  src={catImage}
                  alt={cat.name}
                  className="categories-page__card-image"
                  onError={(e) => {
                    e.target.src = "/assets/images/background-images/casual-1.png";
                  }}
                />
                <div className="categories-page__card-content">
                  <h3 className="categories-page__card-name">{cat.name}</h3>
                  {cat.description && (
                    <p className="categories-page__card-desc">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
