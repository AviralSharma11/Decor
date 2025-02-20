import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "../Styles/ProductComponent.css";

const ProductComponent = ({ products, addToCart }) => {
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")} state={{ product }} style={{textDecoration: "none"}}>
          <div className="product-image">
              <img src={product.image[0]} alt={product.name} />
          </div>
          <div className="product-rating">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
            <span className="reviews">({product.reviews})</span>
          </div>
          <div className="product-detail">
            <div className="product-prices">
              <span className="discounted-prices">₹{product.discountedPrice.toLocaleString()}</span>
              <span className="original-prices">₹{product.originalPrice.toLocaleString()}</span>
            </div>
            <h3 className="product-titles">{product.name}</h3>
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

export default ProductComponent;
