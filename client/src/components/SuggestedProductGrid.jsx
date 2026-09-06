import React from "react";
import ProductCard from "./ProductCard.jsx";

const SuggestedProductGrid = ({ products = [] }) => {
    if (!products.length) {
        return (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#666" }}>
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
