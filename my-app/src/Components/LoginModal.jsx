import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Modal.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("savedCart")) || []);
  const [resendTimer, setResendTimer] = useState(0);

  // ✅ Sync cart from localStorage on load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("savedCart"));
    if (savedCart) {
      setCart(savedCart);
      console.log("Cart loaded from localStorage:", savedCart);
    }
  }, []);

  // ✅ Handle resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  // ✅ Send OTP
  const handleSendOtp = async () => {
    setError("");

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email address.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/send-email-otp", { email });
      setLoading(false);
      setOtpSent(true);
      setResendTimer(30); // Start 30-second countdown
    } catch (err) {
      setError("Failed to send OTP. Try again.");
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      setError("Please request an OTP first.");
      return;
    }
  
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5000/verify-email-otp", { email, otp });
  
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
  
      setUserEmail(email);
      setOtpSent(false);
      setEmail("");
      setOtp("");
  
      // ✅ Fetch cart from MySQL after login
      const cartResponse = await axios.get(`http://localhost:5000/api/cart/${email}`);
      const cartData = cartResponse.data;
  
      console.log("Cart data fetched from MySQL:", cartData);
  
      if (cartData && cartData.length > 0) {
        setCart(cartData); // ✅ No await needed here
        localStorage.setItem("savedCart", JSON.stringify(cartData));
        console.log("Cart data saved in state and localStorage");
      } else {
        console.warn("No cart data found.");
      }
  
      onLogin(); // Trigger login state update
      onClose();
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };
  
  // ✅ Logout
  const handleLogout = async () => {
    try {
      // ✅ Save cart to MySQL before logging out
      for (const item of cart) {
        await axios.post("http://localhost:5000/api/cart/update", {
          email: userEmail,
          productId: item.id,
          quantity: item.quantity,
        });
      }
  
      // ✅ Clear localStorage and state
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("savedCart");
  
      // ✅ Set state to empty
      setUserEmail(null);
      setCart([]); // 👈 Ensure cart is emptied
      localStorage.removeItem("cart");
  
      // ✅ Wait briefly to allow state update to propagate
      await new Promise((resolve) => setTimeout(resolve, 100));
  
      // ✅ Redirect after state update
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to save cart before logout:", err);
    }
  };
  

  // ✅ Handle "Enter" keypress
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!otpSent) {
        handleSendOtp();
      } else {
        handleVerifyOtp(e);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">{userEmail ? "Welcome" : "Login / Register"}</h2>
        <div className="modal-divider"></div>

        {userEmail ? (
          <div className="logged-in-section">
            <p className="logged-in-email">
              Signed in as: <strong>{userEmail}</strong>
            </p>
            <button className="modal-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleVerifyOtp}>
            <input
              type="email"
              placeholder="Enter Email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              required
            />

            {!otpSent ? (
              <button
                type="button"
                className="modal-button"
                onClick={handleSendOtp}
                disabled={loading || resendTimer > 0}
              >
                {loading ? "Wait..." : resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="modal-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={handleKeyPress}
                  required
                />
                <button type="submit" className="modal-button">
                  Verify OTP
                </button>
              </>
            )}

            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
