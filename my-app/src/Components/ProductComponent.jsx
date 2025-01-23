import React from 'react';
import "../Styles/ProductComponent.css";



const ProductComponent = ({ products , addToCart }) => {
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-rating">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
              <span className="reviews">({product.reviews})</span>
            </div>

            <div className="product-prices">
              <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="discounted-price">Rs. {product.discountedPrice.toLocaleString()}</span>
            </div>
          </div>
          <button className="addtocart" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;
