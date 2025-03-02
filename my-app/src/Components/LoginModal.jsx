// import React, { useState } from "react";
// import axios from "axios";
// import "../Styles/Modal.css";

// const countryCodes = [
//   { code: "+91", country: "India", pattern: /^[6-9]\d{9}$/ }, // Indian numbers start with 6-9 and have 10 digits
//   { code: "+1", country: "USA", pattern: /^\d{10}$/ }, // US numbers have 10 digits
//   { code: "+44", country: "UK", pattern: /^\d{10,11}$/ }, // UK numbers have 10-11 digits
//   { code: "+61", country: "Australia", pattern: /^\d{9}$/ }, // Australian numbers have 9 digits
//   { code: "+81", country: "Japan", pattern: /^\d{9,10}$/ }, // Japanese numbers have 9-10 digits
// ];

// const LoginModal = ({ isOpen, onClose }) => {
//   const [countryCode, setCountryCode] = useState("+91"); // Default to India
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   // Get the regex pattern for the selected country
//   const selectedCountry = countryCodes.find((c) => c.code === countryCode);
//   const phonePattern = selectedCountry ? selectedCountry.pattern : null;

//   // Validate phone number
//   const isPhoneValid = phonePattern ? phonePattern.test(phone) : false;

//   if (!isOpen) return null;

//   // Step 1: Request OTP
//   const handleSendOtp = async () => {
//     setError("");

//     if (!isPhoneValid) {
//       setError("Invalid phone number. Please enter a valid number.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/send-otp", { phone: `${countryCode}${phone}` });
//       setOtpSent(true);
//     } catch (err) {
//       setError("Failed to send OTP. Try again.");
//     }
//   };

//   // Step 2: Verify OTP and Log In
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post("http://localhost:5000/verify-otp", { phone: `${countryCode}${phone}`, otp });
//       localStorage.setItem("token", response.data.token);
//       onClose();
//     } catch (err) {
//       setError("Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         <h2 className="modal-title">Login / Register</h2>
//         <div className="modal-divider"></div>
//         <form className="modal-form" onSubmit={handleVerifyOtp}>
//           <div className="phone-input-container">
//             <select className="country-code-dropdown" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
//               {countryCodes.map((c) => (
//                 <option key={c.code} value={c.code}>
//                   {c.country} ({c.code})
//                 </option>
//               ))}
//             </select>
//             <input
//               type="tel"
//               placeholder="Enter Phone Number"
//               className="modal-input"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//           {/* Validation message for invalid phone number */}
//           {!isPhoneValid && phone.length > 0 && (
//             <p className="error-message">Invalid phone number</p>
//           )}
          
//           {!otpSent ? (
//             <button type="button" className="modal-button" onClick={handleSendOtp} disabled={!isPhoneValid}>
//               Send OTP
//             </button>
//           ) : (
//             <>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 className="modal-input"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//               <button type="submit" className="modal-button">
//                 Verify OTP
//               </button>
//             </>
//           )}
//           {error && <p className="error-message">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

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

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  // Send OTP
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

  // Verify OTP
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

      // Restore the cart after login
      const savedCart = localStorage.getItem("savedCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      onLogin();
      onClose();
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    // Store the cart before logout
    localStorage.setItem("savedCart", JSON.stringify(cart));

    // Clear authentication details
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");

    // Clear cart
    setCart([]);
    localStorage.removeItem("cart"); // Clear cart from storage
    setUserEmail(null);
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




