import React from "react";
import "../../Styles/HomePage/ProductCard.css";
import itemsbs from "../../List/itemsbs";
const ProductCard = ({ addToCart}) => {
  return (
    <div className="product-container">
       {itemsbs.map((product) => (
        <div className="product-card">
          <div className="product-images">
            <img src={product.image} alt={product.title} />
            {product.isOnSale && <span className="sale-label">Sale</span>}
          </div>
          <div className="product-details">
            <h3 className="product-title">{product.title}</h3>
            <div className="product-ratings">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
              <span className="reviews">({product.reviews})</span>
            </div>
            <div className="product-prices">
              <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="discounted-price">Rs. {product.discountedPrice.toLocaleString()}</span>
            </div>
          </div>
          <button className="addtocart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
       ))};
    </div>
  );
};

export default ProductCard;
