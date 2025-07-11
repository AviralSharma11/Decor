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

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("savedCart"));
    if (savedCart) {
      setCart(savedCart);
      console.log("Cart loaded from localStorage:", savedCart);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setError("");

    const cleanedEmail = email.trim().toLowerCase();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(cleanedEmail)) {
      setError("Invalid email address.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/send-email-otp", { email: cleanedEmail });
      setLoading(false);
      setOtpSent(true);
      setResendTimer(30);
    } catch (err) {
      console.error("OTP sending failed:", err);
      setError("Failed to send OTP. Try again.");
      setLoading(false);
    }
  };

 const handleVerifyOtp = async (e) => {
  e.preventDefault();

  if (!otpSent) {
    setError("Please request an OTP first.");
    return;
  }

  const cleanedEmail = email.trim().toLowerCase();
  setError("");

  try {
    const response = await axios.post("http://localhost:5000/verify-email-otp", {
      email: cleanedEmail,
      otp,
    });

    console.log("OTP verified, response:", response.data);

    // Set session state early
    localStorage.setItem("userEmail", cleanedEmail);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("isAuthenticated", "true");
    setUserEmail(cleanedEmail);

    // Reset inputs and state
    setOtpSent(false);
    setEmail("");
    setOtp("");

    localStorage.removeItem("savedCart");
    setCart([]);

    const cartResponse = await axios.get(`http://localhost:5000/api/cart/${cleanedEmail}`);
    const cartData = Array.isArray(cartResponse.data) ? cartResponse.data : [];

    if (cartData.length > 0) {
      const updatedCart = cartData.map((item) => ({
        ...item,
        image: Array.isArray(item.image) ? item.image[0] : item.image || "",
      }));

      setCart(updatedCart);
      localStorage.setItem("savedCart", JSON.stringify(updatedCart));
      console.log("New cart loaded and saved:", updatedCart);
    } else {
      console.log("Cart is empty for new user.");
    }

    if (typeof onLogin === "function") {
      onLogin();
    }

    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (err) {
    console.error("Error verifying OTP:", err);
    setError("Invalid OTP. Please try again.");
  }
};


  const handleLogout = async () => {
  try {
    // Save cart to DB before logout
    for (const item of cart) {
      await axios.post("http://localhost:5000/api/cart/update", {
        email: userEmail,
        productId: item.id,
        quantity: item.quantity,
      });
    }

    // Clear storage and cart
    localStorage.clear(); 
    setUserEmail(null);
    setCart([]);

    await new Promise((res) => setTimeout(res, 100));
    window.location.href = "/";
  } catch (err) {
    console.error("Failed to save cart before logout:", err);
  }
};


const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();          // stop the form’s default submit
    otpSent ? handleVerifyOtp(e) // if OTP field visible, verify
           : handleSendOtp();    // else send OTP
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
