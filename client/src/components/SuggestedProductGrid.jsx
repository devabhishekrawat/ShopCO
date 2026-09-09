import React from "react";
import ProductCard from "./ProductCard.jsx";

const SuggestedProductGrid = ({ products = [] }) => {
    console.log(products,"productGrid")
    if (!products.length) {
        return (
            <div className="products-grid__empty">
                No products found.
            </div>
        );
    }

    return (
        <div className="suggested-products-grid products-grid">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default SuggestedProductGrid;
