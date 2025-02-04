import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/HomePage/ProductCard.css";
import itemsbs from "../../List/itemsbs";
const ProductCard = ({ addToCart}) => {
  return (
    <div className="product-container">
       {itemsbs.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.name}`.toLowerCase()} state={{ product }} style={{textDecoration: "none"}}>
          <div className="product-images">
            <img src={product.image} alt={product.name} />
            {product.isOnSale && <span className="sale-label">Sale</span>}
          </div>
          <div className="product-details">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-ratings">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
              <span className="reviews">({product.reviews})</span>
            </div>
            <div className="product-prices">
              <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="discounted-price">Rs. {product.discountedPrice.toLocaleString()}</span>
            </div>
          </div>
          </Link>
          <button className="addtocart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
       ))}
    </div>
  );
};

export default ProductCard;
