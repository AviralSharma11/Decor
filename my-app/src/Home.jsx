import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Showcase from "./Components/HomePage/Showcase";
import GiftingGuide from "./Components/HomePage/GiftingGuide";
import BestSeller from "./Components/HomePage/BestSeller";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import "./Home.css";
import LoginModal from "./Components/LoginModal";
import { useNavigate } from "react-router-dom";
import TopFeedbacks from "./Components/HomePage/TopFeedbacks";
import { API_BASE_URL } from "./api/config";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem("userEmail");
    return savedEmail ? { email: savedEmail } : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const navigate = useNavigate();

  // Fetch cart on mount or when user changes
  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE_URL}/cart/${user.email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch cart");
          return res.json();
        })
        .then((data) => {
          setCart(data);
          localStorage.setItem("cart", JSON.stringify(data));
        })
        .catch((err) => console.error("Fetch cart error:", err));
    }
  }, [user]);

  // Login handler
  const handleLogin = async (email) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setUser({ email });

    try {
      const res = await fetch(`${API_BASE_URL}/cart/${email}`);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
      localStorage.setItem("cart", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }

    setIsLoginModalOpen(false);
  };

  // Add to cart
const addToCart = async (product) => {
  if (!isAuthenticated) {
    setIsLoginModalOpen(true);
    return;
  }

  const payload = {
    email: localStorage.getItem("userEmail"),
    product: {
      productId: product.id, // or product.productId depending on DB schema
      productName: product.name,
      price: Number(product.discountedPrice || product.price),
      quantity: 1,
      image: product.image || "",
      custom_text: product.custom_text || "",
      photo: product.photo || "", 
    },
  };

  console.log("Final cart payload being sent:", payload);

  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to add product:", data.message);
      return;
    }

    // Refresh cart from backend
    const updatedCart = await fetch(`${API_BASE_URL}/cart/${payload.email}`).then(r => r.json());
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};


  // Remove from cart
  const removeFromCart = async (productId, customData = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, productId, customData }),
      });

      if (!res.ok) throw new Error("Failed to remove");

      setCart((prev) => {
        const updated = prev.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity, customData = {}) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          productId,
          quantity: newQuantity,
          customData,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // Fetch products
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  return (
    <div className="Home">
      <Header
        cart={cart}
        onRemoveFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        user={user}
        products={products}
      />
      <Showcase />
      <div className="parallax1">
        <div className="parallax-text">DISCOVER OUR COLLECTION</div>
        <div className="parallax-subtext">
          <ul className="parallax-list">
            <li>PREMIUM QUALITY PRODUCTS</li>
            <li>HANDCRAFTED GIFTS</li>
          </ul>
        </div>
      </div>
      <div className="content-section">
        <GiftingGuide />
      </div>
      <div className="parallax2"></div>
      <div className="content-section">
        <BestSeller
          addToCart={addToCart}
          isAuthenticated={isAuthenticated}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
        <button
          className="collections-btn"
          onClick={() => navigate("/collections")}
        >
          Discover Our Collections
        </button>
      </div>
      <div className="parallax3">
        <TopFeedbacks />
        <button
          className="collections-btn"
          onClick={() => navigate("/feedback")}
        >
          Share Your Experience
        </button>
      </div>
      <div className="content-section">
        <SocialMediaBadges />
      </div>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
      <Footer />
    </div>
  );
}

export default Home;
