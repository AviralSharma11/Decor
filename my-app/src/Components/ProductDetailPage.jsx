import React , {useState} from "react";
import { useLocation , useNavigate } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";

const ProductDetailPage = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Get product data from state

  if (!product) {
    return <h2>Product not found</h2>;
  }
  
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const proceedToCheckout = () =>{
    navigate( "/checkout");
  };

  return (
    <div className="product-detail-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
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
            <span className="discountedPrice">₹{product.discountedPrice.toLocaleString()}</span>
            <span className="originalPrice">₹{product.originalPrice.toLocaleString()}</span>
            <span className="discount">{Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% Off</span>
          </div>
          <button className="buy-now" onClick={proceedToCheckout}>Buy Now</button>
          <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
      <SocialMediaBadges />
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
