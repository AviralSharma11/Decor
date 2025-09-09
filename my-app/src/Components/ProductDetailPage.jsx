import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import { API_BASE_URL } from "../api/config";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const cleanedSlug = slug.replace(/-+$/, '');

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
  const [customisationAlert, setCustomisationAlert] = useState(false);

  useEffect(() => {
  const storedEmail = localStorage.getItem("userEmail");
  if (storedEmail) {
    setUser({ email: storedEmail });
  }

 const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/slug/${cleanedSlug}`);
      const data = await response.json();
      console.log("Fetched image data:", data.image);

      // Ensure `image` is an array
      let images = [];

      // Extract and flatten image data safely
      if (Array.isArray(data.image)) {
        images = data.image.flat(); // flatten in case it's nested
      } else if (typeof data.image === "string") {
        try {
          images = JSON.parse(data.image);
          if (!Array.isArray(images)) {
            images = [images];
          }
        } catch {
          images = data.image.split(",").map((s) => s.trim());
        }
      }

      setProduct({ ...data, image: images });
      setSelectedImage(images[0]);

    } catch (err) {
      console.error("Error fetching product:", err);
    } finally{
      setLoading(false);
    }
  };

  fetchProduct();
  
}, [cleanedSlug]);


  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

   // Add product to cart
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
     
   
     const removeFromCart = async (productId) => {
       if (!isAuthenticated) return;
     
       try {
         const response = await fetch(`${API_BASE_URL}/cart/remove`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             email: localStorage.getItem('userEmail'),
             productId,
             customData: cart.find(item => item.id === productId)?.customData || {}
           }),
         });
     
         const data = await response.json();
     
         if (response.ok) {
           setCart((prevCart) => {
             const updatedCart = prevCart.filter((item) => item.id !== productId);
             localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
             return updatedCart;
           });
           console.log(data.message);
         } else {
           console.error('Failed to remove from cart:', data.message);
         }
       } catch (error) {
         console.error('Error:', error);
       }
     };
     
   
     const updateQuantity = async (productId, newQuantity) => {
       if (newQuantity < 1) return; // Prevent setting quantity to less than 1
     
       try {
         const response = await fetch(`${API_BASE_URL}/cart/update`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             email: localStorage.getItem('userEmail'),
             productId,
             quantity: newQuantity,
             customData: cart.find(item => item.id === productId)?.customData || {}
           }),
   
         });
     
         if (!response.ok) {
           throw new Error(`Failed to update quantity: ${response.statusText}`);
         }
     
         const data = await response.json();
         console.log(data.message);
     
         // Update cart state if successful
         setCart((prevCart) => 
           prevCart.map((item) =>
             item.id === productId ? { ...item, quantity: newQuantity } : item
           )
         );
       } catch (error) {
         console.error("Error updating quantity:", error);
       }
     };

const proceedToCheckout = async () => {
  if (!isCustomisationComplete()) {
    handleCustomisationRequired();
    return;
  }

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
    await fetch(`${API_BASE_URL}/save-order`, {
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

  const isCustomisationComplete = () => {
  if (!product.customisable) return true; // skip check if not customisable

  if (product.photo && !uploadedPhoto) return false;
  if (product.text1 && !customText1.trim()) return false;

  return true;
};

const handleCustomisationRequired = () => {
  setCustomisationAlert(true);
  setTimeout(() => {
    setCustomisationAlert(false);
    setIsCustomisedOpen(true); // open modal after showing alert
  }, 1500); // show alert for 1.5s
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

  // inside ProductDetailPage component (add above the return)
const normalizeInstructions = (instr) => {
  if (!instr && instr !== 0) return [];

  // If it's already an array, flatten nested arrays
  if (Array.isArray(instr)) {
    // flatten to arbitrary depth
    const flat = instr.flat ? instr.flat(Infinity) : instr.reduce((acc, v) => acc.concat(v), []);
    // convert to strings and clean
    return flat
      .map(item => (item === null || item === undefined ? "" : String(item)))
      .map(s => s.trim())
      .filter(s => s && s.toLowerCase() !== "false");
  }

  // If it's not an array: try parsing JSON (some DB fields might be JSON strings)
  if (typeof instr === "string") {
    const trimmed = instr.trim();

    // Try to parse JSON arrays safely
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return normalizeInstructions(parsed);
    } catch (e) {
      // ignore parse error; fall back to splitting the string
    }

    // Insert newline before number-dot patterns like "1.", "2." etc
    const withNewlines = trimmed.replace(/(\d+\.)/g, "\n$1");
    const parts = withNewlines.split("\n").map(p => p.trim()).filter(p => p && p.toLowerCase() !== "false");
    return parts;
  }

  // For numbers or other primitive values
  return [String(instr)].map(s => s.trim()).filter(Boolean);
};


  return (
    <>
      <div className="product-detail-page">
        <Header 
          cart={cart}
          onRemoveFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          user={user}
          products={product}
        />
        <nav className="breadcrumb product-page">
          <Link to="/">Home</Link> &gt;
          <Link to="/collections">Collections</Link> &gt;
          <strong>{product.name}</strong>
        </nav>

        <div className="product-detail-container">
          <div className="product-image-gallery">
            <div className="thumbnail-container">
              {Array.isArray(product.image) && product.image.length > 0 &&
                product.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))
              }
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
                    <ul>
                      {normalizeInstructions(product.instruction).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
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

      {customisationAlert && (
        <div className="popup-alert">
          Please customise the product first
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
