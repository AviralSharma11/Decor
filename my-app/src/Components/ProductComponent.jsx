import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ProductComponent.css";

const ProductComponent = ({ isAuthenticated, setIsLoginModalOpen, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [currentImage, setCurrentImage] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);

        // Initialize image states
        const imageMap = {};
        data.forEach(product => {
          imageMap[product.id] = product.image[0];
        });
        setCurrentImage(imageMap);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));

    const email = localStorage.getItem("userEmail");

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.discountedPrice,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Failed to save cart:", err);
    }

    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div className="product-container">
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
