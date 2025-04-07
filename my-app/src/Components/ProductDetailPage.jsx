import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import { products } from "../List/product";
import LoginModal from "./LoginModal";

const ProductDetailPage = () => {
  const { productName } = useParams();
  const navigate = useNavigate();

  // Convert URL product name back to actual product name (assuming case-insensitivity)
  const formattedProductName = productName.replace(/-/g, " ").toLowerCase();

  // Find product based on name
  const product = products.find(
    (p) => p.name.toLowerCase() === formattedProductName
  );

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const [selectedImage, setSelectedImage] = useState(product.image[0] || "");
  const [isCustomisedOpen, setIsCustomisedOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem("isAuthenticated") === "true"
  );

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

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
  
    const customProduct = {
      ...product,
      uploadedPhoto,
      customText1,
    };
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      let updatedCart;
  
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.name === product.name ? { ...item, ...customProduct, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...customProduct, quantity: 1 }];
      }
  
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const proceedToCheckout = () => {
    const customProduct = {
      ...product,
      uploadedPhoto,
      customText1,
    };
  
    navigate("/checkout", {
      state: {
        product: customProduct,
        productPrice: customProduct.discountedPrice,
        productName: customProduct.name,
      },
    });
  };
  

  const toggleCustomModal = () => {
    setIsCustomisedOpen(!isCustomisedOpen);
    document.body.style.overflowY = !isCustomisedOpen ? "hidden" : "auto";
  };

  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [customText1, setCustomText1] = useState("");

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result); // Save base64 to state
        console.log("Uploaded Photo:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetCustomisation = () => {
    setUploadedPhoto(null);
    setCustomText1("");
  };

  const handleSaveCustomisation = () => {
    // Add custom data to the product in the cart
    const customProduct = {
      ...product,
      uploadedPhoto,
      customText1,
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.name === product.name ? { ...item, ...customProduct } : item
        );
      } else {
        updatedCart = [...prevCart, { ...customProduct, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    toggleCustomModal(); // Close modal after saving
  };

  const sections = [
    { title: "Description", content: product.description },
    { title: "Features", content: product.trending || "No features available" },
    {
      title: "Size & Material",
      content: `Material: ${product.material}, Wood Type: ${product.woodType}`,
    },
  ];

  return (
    <>
      <div className="product-detail-page">
        <Header
          cart={cart}
          onRemoveFromCart={(productId) =>
            setCart(cart.filter((item) => item.id !== productId))
          }
          updateQuantity={(productId, newQuantity) =>
            setCart(
              cart.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
              )
            )
          }
          user={user}
          products={products}
        />
         <nav className="breadcrumb product-page">
              <Link to="/">Home</Link> &gt;
              <Link to="/collections">Collections</Link> &gt;
              <Link to='/product/:productName'><strong>{product.name}</strong></Link>
            </nav>
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
              <span className="discountedPrice">
                ₹{product.discountedPrice.toLocaleString()}
              </span>
              <span className="originalPrice">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="discount">
                {Math.round(
                  ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
                )}
                % Off
              </span>
            </div>
            <div className="buttons">
              <button className="buy-now" onClick={proceedToCheckout}>
                Buy Now
              </button>
              <button className="add-to-cart" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
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
              <button className="close-modal" onClick={toggleCustomModal}>×</button>
            </div>

            <div className="customised-fields">
              {/* Photo Upload with Preview */}
              {product.photo && (
                <div className="custom-field">
                  <label>Upload Photo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  <div className="photo-upload">
                    {uploadedPhoto && (
                      <img 
                        src={uploadedPhoto} 
                        alt="Preview" 
                        className="uploaded-preview"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Text Input */}
              {product.text1 && (
                <div className="custom-field">
                  <label>Custom Text 1:</label>
                  <textarea
                    type="text"
                    placeholder="Enter text"
                    value={customText1}
                    onChange={(e) => setCustomText1(e.target.value)}
                  />
                  <div className="instructions">
                    <p>{product.instruction}</p>
                  </div>
                </div>
                
              )}
            </div>

            <div className="custom-modal-buttons">
              <button onClick={handleResetCustomisation} className="reset-btn">
                Reset
              </button>
              <button onClick={handleSaveCustomisation} className="save-btn">
                Save
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
            setIsLoginModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default ProductDetailPage;
