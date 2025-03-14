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

const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});



  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // ✅ Fetch cart from MySQL on login and sync state + localStorage
  const handleLogin = async (email) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
  
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${email}`);
        if (!response.ok) throw new Error(`Failed to fetch cart: ${response.statusText}`);
        
        const cartData = await response.json();
  
        if (Array.isArray(cartData) && cartData.length > 0) {
            console.log("Fetched cart data:", cartData);
            setCart([...cartData]);
            localStorage.setItem("savedCart", JSON.stringify(cartData));
        } else {
            console.warn("Empty or invalid cart data:", cartData);
            setCart([]);
        }
  
        // ✅ Set user state after successful login
        setUser({ email });
    } catch (error) {
        console.error("Failed to fetch cart:", error.message);
        alert("Failed to fetch cart data. Please try again.");
    }
    
    setIsLoginModalOpen(false);
    window.location.reload();
  };
  
  
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }
  }, []);
  
  // Save cart to MySQL when it updates
  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      const email = localStorage.getItem("userEmail");
  
      cart.forEach(async (product) => {
        const payload = {
          email,
          product: {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: product.quantity || 1,
            image: product.image || "",
          },
        };
  
        console.log("Sending product to server:", JSON.stringify(payload, null, 2));
  
        try {
          const res = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
          if (!res.ok) {
            const data = await res.json();
            console.error(`Failed to add product: ${data.message}`);
          } else {
            console.log("Product added to cart successfully");
          }
        } catch (err) {
          console.error("Failed to save product to cart:", err);
        }
      });
    }
  }, [cart, isAuthenticated]);
  

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
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'), // Assuming email is stored in localStorage
          productId,
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
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          productId,
          quantity: newQuantity,
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
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} />
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
