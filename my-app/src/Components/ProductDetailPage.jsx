import React , {useState} from "react";
import { useLocation , useNavigate } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import { products } from "../List/product";

const ProductDetailPage = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || products; // Get product data from state
  const [selectedImage, setSelectedImage] = useState(product.image[0]);
  const sections = [
    { title: "Description", content: product.description },
    { title: "Features", content: product.trending || "No features available" },
    {
      title: "Size & Material",
      content: `Material: ${product.material}, Wood Type: ${product.woodType}`,
    },
  ];

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
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
      <div className="product-image-gallery">
          <div className="thumbnail-container">
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <div className="main-image-container">
            <img src={selectedImage} alt={product.name} className="main-image" />
          </div>
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
          <div className="accordion">
            {sections.map((section, index) => (
              <div key={index} className="accordion-item">
                <button
                  onClick={() => toggleSection(index)}
                  className="accordion-header"
                >
                  {section.title}
                  <span className="accordion-icon">
                    {openSection === index ? "▲" : "▼"}
                  </span>
                </button>
                {openSection === index && (
                  <div className="accordion-content">{section.content}</div>
                )}
              </div>
            ))}
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
