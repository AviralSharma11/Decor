import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/ProductComponent.css";
import { API_BASE_URL } from "../api/config";

const ProductComponent = ({ products, isAuthenticated, setIsLoginModalOpen, addToCart }) => {
  const [addedToCart, setAddedToCart] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [showCustomisablePopup, setShowCustomisablePopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const handleOkClick = () => {
    if (selectedProduct) {
      setShowCustomisablePopup(false);
      navigate(
        `/product/${selectedProduct.name}`.toLowerCase().replace(/\s+/g, "-"),
        { state: { product: selectedProduct } }
      );
    }
  };

  // Initialize images when products change
  useEffect(() => {
    const imageMap = {};
    products.forEach((product) => {
      let firstImage = product.image;
      if (Array.isArray(firstImage)) firstImage = firstImage[0];
      if (typeof firstImage === "string") {
        imageMap[product.id] = firstImage.startsWith("/") ? firstImage : `/${firstImage}`;
      }
    });
    setCurrentImage(imageMap);
  }, [products]);

const handleAddToCart = async (product) => {
    // Prevent adding if customisable
    if (product.customisable) {
      setSelectedProduct(product);
      setShowCustomisablePopup(true);
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

    const email = localStorage.getItem("userEmail");

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.discountedPrice || product.price || product.originalPrice || 0,
          },
        }),
      });

      if (!response.ok) throw new Error(`Failed to add to cart: ${response.statusText}`);
    } catch (err) {
      console.error("Failed to save cart:", err);
    }

    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div className="product-container">
      {/* Customisable Popup */}
      {showCustomisablePopup && (
        <div className="popup-overlay" onClick={() => setShowCustomisablePopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <p>This is a customisable product. Please go to the product page and customise it before adding to cart.</p>
            <button onClick={handleOkClick}>OK</button>
          </div>
        </div>
      )}

      {[...products]
        .sort((a, b) => (a.comingSoon === b.comingSoon ? 0 : a.comingSoon ? 1 : -1))
        .map((product) => {
          const isComingSoon = product.comingSoon;

          return (
            <div key={product.id} className="product-card">
              {isComingSoon ? (
                <>
                  <div className="product-image">
                    <img src={product.image?.[0]} alt={product.name} />
                  </div>
                  <div className="product-detail">
                    <h3 className="product-titles">{product.name}</h3>
                    <div className="product-prices coming-soon-text">Launching Soon</div>
                  </div>
                  <button className="addtocart disabled" disabled>
                    Coming Soon
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/product/${product.name}`.toLowerCase().replace(/\s+/g, "-")}
                    state={{ product }}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="product-image"
                      onMouseEnter={() =>
                        setCurrentImage((prev) => ({
                          ...prev,
                          [product.id]: product.image?.[1] || product.image?.[0],
                        }))
                      }
                      onMouseLeave={() =>
                        setCurrentImage((prev) => ({
                          ...prev,
                          [product.id]: product.image?.[0],
                        }))
                      }
                    >
                      <img src={currentImage[product.id]} alt={product.name} />
                    </div>
                    <div className="product-rating">
                      {"★".repeat(Math.floor(product.rating))}
                      {"☆".repeat(5 - Math.floor(product.rating))}
                      <span className="reviews">({product.reviews})</span>
                    </div>
                    <div className="product-detail">
                      <div className="product-prices">
                        <span className="discounted-prices">
                          ₹{product.discountedPrice.toLocaleString()}
                        </span>
                        <span className="original-prices">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="product-titles">{product.name}</h3>
                    </div>
                  </Link>
                  <button
                    className={`addtocart ${addedToCart[product.id] ? "added" : ""}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedToCart[product.id]}
                  >
                    {addedToCart[product.id] ? "Added to Cart" : "Add to Cart"}
                  </button>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ProductComponent;
