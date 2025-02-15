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
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(300);
  const [image, setImage] = useState(null);
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

  const resetToDefault = () => {
    setImage(null); // Clears the uploaded image
    setWidth(200);  // Resets width to default
    setHeight(300); // Resets height to default
  };
  

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
            <button className="customised-btn" onClick={toggleCustomModal}>Customised to your needs</button>
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
                  <button onClick={() => setWidth(200) & setHeight(300)}>8"x12"</button>
                  <button onClick={() => setWidth(300) & setHeight(450)}>12"x18"</button>
                  <button onClick={() => setWidth(400) & setHeight(600)}>18"x24"</button>
                </div>
                <label htmlFor="upload">Upload Photo:</label>
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
              {image && (
                <div className="frame" style={{ width, height }}>
                  <img src={image} alt="Preview" className="photo" />
                  <div className="preview-text">PREVIEW</div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductDetailPage;
