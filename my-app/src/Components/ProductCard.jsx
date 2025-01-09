import React from "react";
import "../Styles/ProductCard.css"; // Add your CSS styles here

const ProductCard = ({ image, isOnSale, title, rating, reviews, originalPrice, discountedPrice }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
        {isOnSale && <span className="sale-label">Sale</span>}
      </div>
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <div className="product-rating">
          {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
          <span className="reviews">({reviews})</span>
        </div>
        <div className="product-prices">
          <span className="original-price">Rs. {originalPrice.toLocaleString()}</span>
          <span className="discounted-price">Rs. {discountedPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
