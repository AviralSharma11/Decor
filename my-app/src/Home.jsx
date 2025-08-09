import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Showcase from "./Components/HomePage/Showcase";
import GiftingGuide from "./Components/HomePage/GiftingGuide";
import BestSeller from "./Components/HomePage/BestSeller";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import "./Home.css";
import LoginModal from "./Components/LoginModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", message: "" });
  const [products, setProducts] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load authentication and user state from localStorage
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const savedUser = localStorage.getItem("user");
    setIsAuthenticated(auth);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      const savedUser = localStorage.getItem("user");
      setIsAuthenticated(auth);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

  syncAuth();

  // Listen for storage changes from other tabs or components
  window.addEventListener("storage", syncAuth);

  return () => {
    window.removeEventListener("storage", syncAuth);
  };
}, []);


  const handleLogin = async (email) => {
    const userData = { email };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    if (email === "aviral0201sharma@gmail.com") {
      navigate("/admin-dashboard");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${email}`);
      const cartData = await response.json();

      if (Array.isArray(cartData)) {
        const fixedCart = cartData.map((item) => {
          let parsedImage;
          try {
            parsedImage = typeof item.image === "string" ? JSON.parse(item.image) : item.image;
          } catch {
            parsedImage = [item.image];
          }

          return {
            ...item,
            image: parsedImage,
            discountedPrice: parseFloat(item.discountedPrice),
            quantity: item.quantity || 1,
          };
        });

        setCart(fixedCart);
        localStorage.setItem("cart", JSON.stringify(fixedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }

    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      const email = localStorage.getItem("userEmail");

      cart.forEach(async (product) => {
        const parsedPrice = parseFloat(product.discountedPrice);
        if (!product.id || !product.name || isNaN(parsedPrice)) {
          console.warn("Skipping invalid product:", product);
          return;
        }

        const payload = {
          email,
          product: {
            id: product.id,
            name: product.name,
            price: parsedPrice,
            quantity: product.quantity || 1,
            image: product.image || [],
          },
        };

        try {
          const res = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await res.json();
          if (!res.ok) {
            console.error("Cart sync failed:", result.message || result);
          }
        } catch (err) {
          console.error("Failed to sync product to cart:", err);
        }
      });
    }
  }, [cart, isAuthenticated]);

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const updated = cart.filter((item) => item.id !== productId);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
          quantity: newQuantity,
        }),
      });
      if (res.ok) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Message Sent!", "Thank you for your time", "success");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        Swal.fire("Error!", data.error || "Submission failed", "error");
      }
    } catch (err) {
      Swal.fire("Submission Failed", "Try again later.", "error");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll(".parallax-text, .parallax-subtext").forEach((text) => {
        if (text.getBoundingClientRect().top < window.innerHeight * 0.8) {
          text.classList.add("show");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      </div>
      <div className="parallax3">
        <div className="feedback-form">
          <h2> FEEDBACK</h2>
          <form onSubmit={handleSubmit} className="form">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
            <button type="submit" className="send-btn">SEND</button>
          </form>
        </div>
      </div>
      <div className="content-section">
        <SocialMediaBadges />
      </div>
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      )}
      <Footer />
    </div>
  );
}

export default Home;
