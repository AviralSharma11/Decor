import React, { useState, useEffect } from "react";
import faqs from "../../List/faq";
import "../../Styles/Footer/faq.css";
import Footer from "../Footer";
import LoginModal from "../LoginModal";
import SocialMediaBadges from "../SocialMediaBadges";
import Header from "../Header";
import { API_BASE_URL } from "../../api/config";

export default function FAQ() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [products, setProducts] = useState([]);

  // Fetch logged in user's email
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }
  }, []);

  //  Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart((prevCart) => {
          const updatedCart = prevCart.filter((item) => item.id !== productId);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          return updatedCart;
        });
        console.log(data.message);
      } else {
        console.error("Failed to remove from cart:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <>
      <div className="faq-container">
        <Header
          cart={cart}
          onRemoveFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          user={user}
          products={products}
        />
        <h1 className="faq-title">Frequently Asked Questions</h1>
        {Object.entries(faqs).map(([section, questions], i) => (
          <div key={i} className="faq-section">
            <h2 className="faq-section-title">{section}</h2>
            {questions.map(({ q, a }, j) => (
              <div key={j} className="faq-item">
                <p className="faq-question">{q}</p>
                <p className="faq-answer">{a}</p>
              </div>
            ))}
          </div>
        ))}
        <SocialMediaBadges />
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
      </div>
      <Footer />
    </>
  );
}
