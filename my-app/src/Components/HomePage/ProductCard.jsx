import React , {useState} from "react";
import { Link } from "react-router-dom";
import "../../Styles/HomePage/ProductCard.css";
import itemsbs from "../../List/itemsbs";
const ProductCard = ({ addToCart,  isAuthenticated, setIsLoginModalOpen}) => {

  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

    const email = localStorage.getItem("userEmail");

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product }),
      });
    } catch (err) {
      console.error("Failed to save cart:", err);
    }

    // Reset button state after 3 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div className="product-container">
       {itemsbs.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")} state={{ product }} style={{textDecoration: "none"}}>
          <div className="product-images">
            <img src={product.image[0]} alt={product.name} />
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

export default ProductCard;
