import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Modal.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("savedCart")) || []);
  const [resendTimer, setResendTimer] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("savedCart"));
    if (savedCart) {
      setCart(savedCart);
      console.log("Cart loaded from localStorage:", savedCart);
    }
  }, []);

  //  Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  //  Send OTP
  const handleSendOtp = async () => {
    setError("");

    // Validate email format
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

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
  
    if (!otpSent) {
      setError("Please request an OTP first.");
      return;
    }
  
    setError("");
  
    try {
      console.log("Entered try block...");
      const response = await axios.post("http://localhost:5000/verify-email-otp", { email, otp });
  
      console.log("OTP verified, response:", response.data);
  
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
  
      setUserEmail(email);
      setOtpSent(false);
      setEmail("");
      setOtp("");
  
      const cartResponse = await axios.get(`http://localhost:5000/api/cart/${email}`);
      console.log("Full cart response:", cartResponse);
  
      const cartData = cartResponse.data.cart || cartResponse.data;
  
      if (cartData?.length > 0) {
        const updatedCart = cartData.map((item) => ({
          ...item,
          image: Array.isArray(item.image) ? item.image[0] : item.image || "",
        }));
  
        setCart(updatedCart);
        localStorage.setItem("savedCart", JSON.stringify(updatedCart));
        console.log("Cart saved to localStorage:", updatedCart);
      } else {
        console.warn("No cart data found.");
      }
  
      if (typeof onLogin === "function") {
        onLogin();
        console.log("Reloading...");
      } else {
        console.warn("onLogin is not a function or was not provided.");
      }
      
      onClose();
      setTimeout(() => {
        console.log("Actually reloading...");
        window.location.reload();
      }, 100);
  
    } catch (err) {
      console.error("Error during OTP verification:", err);
      setError("Invalid OTP. Please try again.");
    }
  };
  

  //  Logout
  const handleLogout = async () => {
    try {
      // Save cart to MySQL before logging out
      for (const item of cart) {
        await axios.post("http://localhost:5000/api/cart/update", {
          email: userEmail,
          productId: item.id,
          quantity: item.quantity,
        });
      }

      //  Clear user data from localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("savedCart");

      setUserEmail(null);
      setCart([]); // Clear cart state

      //  Short delay to let state updates propagate
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to home after logout
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to save cart before logout:", err);
    }
  };
  

  // Handle "Enter" keypress
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
