import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../Styles/HomePage/FeedbackForm.css";
import Header from "../Header";
import SocialMediaBadges from "../SocialMediaBadges";
import Footer from "../Footer";
import LoginModal from "../LoginModal";

export default function FeedbackForm() {
      const [products, setProducts] = useState([]);
    
      useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://72.60.97.97:5000/api/products");
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://72.60.97.97:5000/api/feedback", form);

      Swal.fire({
        title: "Thank You!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#ff914d"
      });

      setForm({ name: "", email: "", rating: "", message: "" });
    } catch (err) {
      Swal.fire({
        title: "Oops...",
        text: err.response?.data?.error || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ff914d"
      });
    }
  };

      const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
      });
      const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
      const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true"; // Check login status
      });
  
        const [user, setUser] = useState(() => {
          const savedUser = localStorage.getItem("user");
          return savedUser ? JSON.parse(savedUser) : null;
        });
        
          useEffect(() => {
            const storedEmail = localStorage.getItem("userEmail");
            if (storedEmail) {
              setUser({ email: storedEmail });
            }
          }, []);
  

    const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
  
    try {
      const response = await fetch("http://72.60.97.97:5000/api/cart/remove", {
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
      const response = await fetch("http://72.60.97.97:5000/api/cart/update", {
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

  return (
    <>
        <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products}/>
        <div className="feedback-page">
        <form className="feedback-form" onSubmit={handleSubmit}>
            <h1 className="form-title">FEEDBACK FORM</h1>

            <div className="form-group">
            <label>Name :</label>
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label>Email :</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label>Rate Us :</label>
            <div className="radio-group">
                <label>
                <input
                    type="radio"
                    name="rating"
                    value="5"
                    checked={form.rating === "5"}
                    onChange={handleChange}
                    required
                /> ⭐⭐⭐⭐⭐ Excellent
                </label>
                <label>
                <input
                    type="radio"
                    name="rating"
                    value="4"
                    checked={form.rating === "4"}
                    onChange={handleChange}
                /> ⭐⭐⭐⭐ Good
                </label>
                <label>
                <input
                    type="radio"
                    name="rating"
                    value="3"
                    checked={form.rating === "3"}
                    onChange={handleChange}
                /> ⭐⭐⭐ Average
                </label>
                <label>
                <input
                    type="radio"
                    name="rating"
                    value="2"
                    checked={form.rating === "2"}
                    onChange={handleChange}
                /> ⭐⭐ Poor
                </label>
                <label>
                <input
                    type="radio"
                    name="rating"
                    value="1"
                    checked={form.rating === "1"}
                    onChange={handleChange}
                /> ⭐ Very Poor
                </label>
            </div>
            </div>

            <div className="form-group">
            <label>Message :</label>
            <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
            ></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
        </div>
        <SocialMediaBadges />
        <Footer />
        {isLoginModalOpen && (
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={() => {
                  setIsAuthenticated(true);
                  localStorage.setItem("isAuthenticated", "true");
                  setIsLoginModalOpen(false); // Close modal after login
                  window.location.reload();
                }}
              />
            )}
    </>
  );
}
