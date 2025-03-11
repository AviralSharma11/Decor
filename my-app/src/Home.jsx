import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Showcase from "./Components/HomePage/Showcase";
import GiftingGuide from "./Components/HomePage/GiftingGuide";
import BestSeller from "./Components/HomePage/BestSeller";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import "./Home.css";
import LoginModal from "./Components/LoginModal";

function Home() {
  const [cart, setCart] = useState(() => {
    try {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return [];
    }
});

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Fetch cart from MySQL on login
  const handleLogin = async (email) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);

    try {
        const response = await fetch(`http://localhost:5000/api/cart/${email}`);
        const cartData = await response.json();

        if (!Array.isArray(cartData)) {
            console.error("Invalid cart data format:", cartData);
            setCart([]); // Ensure the cart doesn't break
        } else {
            setCart(cartData);
        }

        localStorage.setItem("cart", JSON.stringify(cartData)); // Save to local storage
    } catch (error) {
        console.error("Failed to fetch cart:", error);
    }

    setIsLoginModalOpen(false);
};


  // Save cart to MySQL when it updates
  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
        const email = localStorage.getItem("userEmail");
        const payload = { email, cart };

        console.log("Sending cart to server:", payload); // Debugging output

        fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new Error(`Failed to add to cart: ${data.message}`);
                });
            }
            console.log("Cart saved successfully");
        })
        .catch((err) => console.error("Failed to save cart:", err));
    }
}, [cart, isAuthenticated]);




  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
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

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = async (productId) => {
    const email = localStorage.getItem("userEmail");

    try {
        const response = await fetch("http://localhost:5000/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                productId: String(productId), // Ensure consistent type
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to remove product");
        }

        console.log("Product removed from cart");
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
        console.error("Failed to remove from cart:", error);
    }
};


  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const texts = document.querySelectorAll(".parallax-text, .parallax-subtext");
      texts.forEach((text) => {
        const textPosition = text.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        if (textPosition < screenHeight * 0.8) {
          text.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="Home">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
      <Showcase />
      <div className="parallax1">
        <div className="parallax-text">Discover Our Collection</div>
        <div className="parallax-subtext">
          <ul className="parallax-list">
            <li>Premium Quality Pr oducts</li>
            <li>Handcrafted Gifts</li>
            <li>Exclusive Discounts</li>
            <li>Fast & Safe Delivery</li>
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
      <div className="parallax3"></div>
      <div className="content-section">
        <SocialMediaBadges />
        <Footer />
      </div>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin} // Pass `handleLogin` correctly
        />
      )}
    </div>
  );
}

export default Home;
