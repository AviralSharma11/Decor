import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

const ProductDetailPage = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const formattedProductName = productName.replace(/-/g, " ").toLowerCase();

  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedImage, setSelectedImage] = useState("");
  const [isCustomisedOpen, setIsCustomisedOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [customText1, setCustomText1] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/name/${formattedProductName}`);
        const data = await res.json();
        if (data) {
          setProduct(data);
          setSelectedImage(data.image[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [formattedProductName]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const addToCart = () => {
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
      const updatedCart = existingItem
        ? prevCart.map((item) =>
            item.name === product.name
              ? { ...item, ...customProduct, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...customProduct, quantity: 1 }];

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const proceedToCheckout = async () => {
    const customProduct = {
      ...product,
      uploadedPhoto,
      customText1,
    };

    const orderData = {
      email: user?.email,
      fullName: user?.fullName || "Guest",
      phone: user?.phone || "N/A",
      productName: customProduct.name,
      price: customProduct.discountedPrice,
      customText1,
      uploadedPhoto,
    };

    try {
      await fetch("http://localhost:5000/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      navigate("/checkout", {
        state: {
          product: customProduct,
          productPrice: customProduct.discountedPrice,
          productName: customProduct.name,
        },
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const toggleCustomModal = () => {
    setIsCustomisedOpen(!isCustomisedOpen);
    document.body.style.overflowY = !isCustomisedOpen ? "hidden" : "auto";
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetCustomisation = () => {
    setUploadedPhoto(null);
    setCustomText1("");
  };

  const handleSaveCustomisation = () => {
    const customProduct = {
      ...product,
      uploadedPhoto,
      customText1,
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      const updatedCart = existingItem
        ? prevCart.map((item) =>
            item.name === product.name ? { ...item, ...customProduct } : item
          )
        : [...prevCart, { ...customProduct, quantity: 1 }];

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    toggleCustomModal();
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  const sections = [
    { title: "Description", content: product.description },
    {
      title: "Size & Material",
      content: `Size: ${product.size}, Material: ${product.material}`,
    },
  ];

  return (
    <>
      <div className="product-detail-page">
        <Header cart={cart} user={user} />
        <nav className="breadcrumb product-page">
          <Link to="/">Home</Link> &gt;
          <Link to="/collections">Collections</Link> &gt;
          <strong>{product.name}</strong>
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
              <span className="discountedPrice">₹{product.discountedPrice}</span>
              <span className="originalPrice">₹{product.originalPrice}</span>
              <span className="discount">
                {Math.round(
                  ((product.originalPrice - product.discountedPrice) /
                    product.originalPrice) *
                    100
                )}
                % Off
              </span>
            </div>

            <div className="buttons">
              <button className="buy-now" onClick={proceedToCheckout}>
                Buy Now
              </button>
              <button className="add-to-cart" onClick={addToCart}>
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
              <button className="close-modal" onClick={toggleCustomModal}>
                ×
              </button>
            </div>

            <div className="customised-fields">
              {product.photo && (
                <div className="custom-field">
                  <label>Upload Photo:</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  {uploadedPhoto && (
                    <img
                      src={uploadedPhoto}
                      alt="Preview"
                      className="uploaded-preview"
                    />
                  )}
                </div>
              )}

              {product.text1 && (
                <div className="custom-field">
                  <label>Custom Text 1:</label>
                  <textarea
                    placeholder="Enter text"
                    value={customText1}
                    onChange={(e) => setCustomText1(e.target.value)}
                  />
                  <div className="instructions">
                    {product.instruction.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
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
