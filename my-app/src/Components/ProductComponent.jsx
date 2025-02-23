import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/ProductComponent.css";

const ProductComponent = ({ products, addToCart }) => {
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true, // Mark the product as added
    }));

    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [product.id]: false,
      }));
    }, 3000);
  };

  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <Link
            to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")}
            state={{ product }}
            style={{ textDecoration: "none" }}
          >
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
                <span className="discounted-prices">
                  ₹{product.discountedPrice.toLocaleString()}
                </span>
                <span className="original-prices">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              </div>
              <h3 className="product-titles">{product.name}</h3>
            </div>
          </Link>
          <button
            className={`addtocart ${addedToCart[product.id] ? "added" : ""}`}
            onClick={() => handleAddToCart(product)}
            disabled={addedToCart[product.id]} // Disable button when added
          >
            {addedToCart[product.id] ? "Added to Cart " : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;
