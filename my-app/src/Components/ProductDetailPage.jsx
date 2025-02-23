import React , {useState , useEffect} from "react";
import { useLocation , useNavigate } from "react-router-dom";
import "../Styles/ProductDetailPage.css";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import { products } from "../List/product";

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
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [frameWidth, setFrameWidth] = useState(100);
  const [frameHeight, setFrameHeight] = useState(100); 
  const [frameTop, setFrameTop] = useState(100);
  const [frameLeft, setFrameLeft] = useState(160);
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = products.find((p) => p.id === 1);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetToDefault = () => {
    setImage(null); // Clears the uploaded image
    setWidth(100);  // Resets width to default
    setHeight(100); // Resets height to default
    setFrameHeight(100);
    setFrameWidth(100);
    setFrameTop(100);
    setFrameLeft(160);
  };

  const sizeOptions = {
    "Table Decors": [
      { width: 85, height: 124, label: 'Small' , frameHeight:126 , frameWidth:89 , top: 100 , left:160 },
      { width: 106, height: 151, label: 'Medium', frameHeight:155 , frameWidth:110, top: 85 , left:174},
      { width: 141, height: 201, label: 'Large', frameHeight:205 , frameWidth:145, top: 60 , left:200},
    ],
    "Wall Art": [
      { width: 200, height: 300, label: 'Small' },
      { width: 300, height: 400, label: 'Medium' },
      { width: 400, height: 500, label: 'Large' },
    ],
    "default": [
      { width: 100, height: 100, label: 'Small' },
      { width: 150, height: 150, label: 'Medium' },
      { width: 200, height: 200, label: 'Large' },
    ],
  };
  
  const selectedSizes = sizeOptions[selectedProduct.type] || sizeOptions["default"];  
  
  return (
    <>
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

            {/* Added Upload and Input Fields */}
            <div className="modal-body">
              <div className="inputs">
              <div className="button-container">
                {selectedSizes.map((size, index) => (
                  <button key={index} onClick={() => { setWidth(size.width); setHeight(size.height); setFrameHeight(size.frameHeight) ; setFrameWidth(size.frameWidth) ; setFrameTop(size.top) ; setFrameLeft(size.left) }}>
                    {size.label}
                  </button>
                ))}
              </div>
                <label htmlFor="upload" className="custom-file-upload">Upload Photo:</label>
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {/* Reset Button */}
                <button className="reset-button" onClick={resetToDefault}>
                  Reset
                </button>
              </div>
              
              <div className="image-container" style={{
                backgroundImage: `url(${selectedProduct.backgroundImage})`,
              }}>
              <div
                  className="frame"
                  style={{
                    backgroundImage: `url(${selectedProduct.frame})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    top: `${frameTop}px`,
                    left: `${frameLeft}px`,
                    cursor: selectedProduct.isDraggable ? "grab" : "default",
                  }}
                  onMouseDown={selectedProduct.isDraggable ? handleMouseDown : undefined}
                  onMouseMove={selectedProduct.isDraggable ? handleMouseMove : undefined}
                  onMouseUp={selectedProduct.isDraggable ? handleMouseUp : undefined}
                  onMouseLeave={selectedProduct.isDraggable ? handleMouseUp : undefined}
                >
                  {image && (
                    <div style={{ width: `${width}px`, height: `${height}px`, position: "relative", display:"flex", justifyContent:"center" }}>
                      <img src={image} className="photo" alt="Preview" style={{ width: `${width}px`, height: `${height}px` }} />
                      <div className="preview-text">{selectedProduct.preview}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductDetailPage;
