import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const location = useLocation();
  const product = location.state?.product; // Get product data from state

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="product-rating">
          {"★".repeat(Math.floor(product.rating))}
          {"☆".repeat(5 - Math.floor(product.rating))}
          <span className="reviews">({product.reviews})</span>
        </div>
        <div className="product-prices">
          <span className="discounted-price">₹{product.discountedPrice.toLocaleString()}</span>
          <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          <span className="discount">{Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% Off</span>
        </div>
        <button className="buy-now">Buy Now</button>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
