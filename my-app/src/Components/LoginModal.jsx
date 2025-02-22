import React, { useState } from "react";
import axios from "axios";
import "../Styles/Modal.css";

const countryCodes = [
  { code: "+91", country: "India", pattern: /^[6-9]\d{9}$/ }, // Indian numbers start with 6-9 and have 10 digits
  { code: "+1", country: "USA", pattern: /^\d{10}$/ }, // US numbers have 10 digits
  { code: "+44", country: "UK", pattern: /^\d{10,11}$/ }, // UK numbers have 10-11 digits
  { code: "+61", country: "Australia", pattern: /^\d{9}$/ }, // Australian numbers have 9 digits
  { code: "+81", country: "Japan", pattern: /^\d{9,10}$/ }, // Japanese numbers have 9-10 digits
];

const LoginModal = ({ isOpen, onClose }) => {
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Get the regex pattern for the selected country
  const selectedCountry = countryCodes.find((c) => c.code === countryCode);
  const phonePattern = selectedCountry ? selectedCountry.pattern : null;

  // Validate phone number
  const isPhoneValid = phonePattern ? phonePattern.test(phone) : false;

  if (!isOpen) return null;

  // Step 1: Request OTP
  const handleSendOtp = async () => {
    setError("");

    if (!isPhoneValid) {
      setError("Invalid phone number. Please enter a valid number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/send-otp", { phone: `${countryCode}${phone}` });
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  // Step 2: Verify OTP and Log In
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { phone: `${countryCode}${phone}`, otp });
      localStorage.setItem("token", response.data.token);
      onClose();
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Login / Register</h2>
        <div className="modal-divider"></div>
        <form className="modal-form" onSubmit={handleVerifyOtp}>
          <div className="phone-input-container">
            <select className="country-code-dropdown" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.country} ({c.code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="modal-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {/* Validation message for invalid phone number */}
          {!isPhoneValid && phone.length > 0 && (
            <p className="error-message">Invalid phone number</p>
          )}
          
          {!otpSent ? (
            <button type="button" className="modal-button" onClick={handleSendOtp} disabled={!isPhoneValid}>
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="modal-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="modal-button">
                Verify OTP
              </button>
            </>
          )}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
