import React , {useState , useEffect} from "react";
import { useLocation , useNavigate } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import { products } from "../List/product";
import LoginModal from "./LoginModal";

const ProductDetailPage = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  useEffect(() => {
    if (cart.length > 0) {  // Prevent overwriting with an empty array on first load
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const [isCustomisedOpen , setIsCustomisedOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || products; // Get product data from state
  const [selectedImage, setSelectedImage] = useState(product.image[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"; // Check login status
  });
  const sections = [
    { title: "Description", content: product.description },
    { title: "Features", content: product.trending || "No features available" },
    {
      title: "Size & Material",
      content: `Material: ${product.material}, Wood Type: ${product.woodType}`,
    },
  ];

    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    });
    
      useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
          setUser({ email: storedEmail });
        }
      }, []);
  
  
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
  if (!product) {
    return <h2>Product not found</h2>;
  }
  
  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true); // Open login modal
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let updatedCart;
  
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
  
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
      return updatedCart;
    });
  };
  

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
      return updatedCart;
    });
  };
  
  // update quantity
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
      return updatedCart;
    });
  };
  

  const proceedToCheckout = () =>{
    navigate( "/checkout");
  };

  const toggleCustomModal = () => {
    setIsCustomisedOpen(!isCustomisedOpen);
    document.body.style.overflowY = !isCustomisedOpen ? "hidden" : "auto";
  };


  return (
    <>
      <div className="product-detail-page">
        <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} />
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
            <h1 className="product-name">{product.name}</h1>
            <div className="product-rating">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
              <span className="reviews">({product.reviews})</span>
            </div>
            {product.customisable && (
              <button className="customised-btn" onClick={toggleCustomModal}>
                Customised to your needs
              </button>
            )}
            <div className="product-prices">
              <span className="discountedPrice">₹{product.discountedPrice.toLocaleString()}</span>
              <span className="originalPrice">₹{product.originalPrice.toLocaleString()}</span>
              <span className="discount">{Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% Off</span>
            </div>
            <div className="buttons">
              <button className="buy-now" onClick={proceedToCheckout}>Buy Now</button>
              <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
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
          </div>
        </div>
        <SocialMediaBadges />
        <Footer />
      </div>

      {isCustomisedOpen && (
        <div className="customised-modal">
          <div className="modal-content">
            <div className="modal-top">
              <h4>Set according to your needs</h4>
              <button className="close-modal" onClick={toggleCustomModal}>
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={() => {
                  setIsAuthenticated(true);
                  localStorage.setItem("isAuthenticated", "true");
                  setIsLoginModalOpen(false); // Close modal after login
                  window.location.reload();
                }}
              />
            )}

    </>
  );
};

export default ProductDetailPage;
