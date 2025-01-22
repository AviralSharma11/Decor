import React from 'react';
import "../Styles/ProductComponent.css";

const ProductComponent = ({ products }) => {
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <h3>{product.name}</h3>
            <div className="product-price">
              <p>₹{product.price}</p>
              <p className='discount'>{product.discount}% OFF</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;
