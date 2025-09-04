import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/Checkout.css";
import { API_BASE_URL } from "../api/config";

const Checkout = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [localities, setLocalities] = useState([]);
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    locality: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Validate form
  useEffect(() => {
    const allFieldsFilled = Object.values(formFields).every(
      (value) => value.trim() !== ""
    );
    const validPin = /^[1-9][0-9]{5}$/.test(formFields.pinCode);
    const validPhone = /^[6-9]\d{9}$/.test(formFields.phone);

    setIsFormValid(allFieldsFilled && validPin && validPhone);
  }, [formFields]);

  const handleBillingAddressChange = (e) => {
    setBillingSameAsShipping(e.target.value === "same");
  };

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const location = useLocation();
  const { productPrice, productName } = location.state || {};

  // Pincode API integration
  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (formFields.pinCode.length === 6 && /^[1-9][0-9]{5}$/.test(formFields.pinCode)) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${formFields.pinCode}`
          );
          const data = await response.json();

          if (data[0].Status === "Success") {
            const postOffices = data[0].PostOffice;
            setLocalities(postOffices);

            if (postOffices.length === 1) {
              setFormFields((prev) => ({
                ...prev,
                locality: postOffices[0].Name,
                city: postOffices[0].District,
                state: postOffices[0].State,
              }));
            } else {
              setFormFields((prev) => ({
                ...prev,
                locality: "",
                city: "",
                state: "",
              }));
            }
          } else {
            setLocalities([]);
            setFormFields((prev) => ({
              ...prev,
              locality: "",
              city: "",
              state: "",
            }));
          }
        } catch (error) {
          console.error("Error fetching pincode:", error);
        }
      }
    };

    fetchPincodeDetails();
  }, [formFields.pinCode]);

  const handlePayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/razorpay-key`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (!data.key) throw new Error("Razorpay key not received from backend");

      const fullName = `${formFields.firstName} ${formFields.lastName}`;
      const email = localStorage.getItem("userEmail") || "aviral@example.com";

      const options = {
        key: data.key,
        amount: productPrice * 100,
        currency: "INR",
        name: "OceanWays",
        description: productName,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: fullName,
          email: email,
          contact: formFields.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error fetching Razorpay key:", error);
    }
  };

  const validPin = /^[1-9][0-9]{5}$/.test(formFields.pinCode);
  const validPhone = /^[6-9]\d{9}$/.test(formFields.phone);

  return (
    <div className="checkout-container">
      <h1 className="page-title">Checkout</h1>
      <div className="format">
        <div className="section delivery">
          <h2>Delivery</h2>
          <form>
            <label>
              Country/Region <span className="compulsory">*</span>
              <select>
                <option value="India">India</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                First Name <span className="compulsory">*</span>
                <input
                  type="text"
                  name="firstName"
                  value={formFields.firstName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Last Name <span className="compulsory">*</span>
                <input
                  type="text"
                  name="lastName"
                  value={formFields.lastName}
                  onChange={handleChange}
                />
              </label>
            </div>
            <label>
              Address <span className="compulsory">*</span>
              <input
                type="text"
                name="address"
                value={formFields.address}
                onChange={handleChange}
              />
            </label>
            <div className="form-row">
              <label>
                PIN Code <span className="compulsory">*</span>
                <input
                  type="text"
                  name="pinCode"
                  value={formFields.pinCode}
                  onChange={handleChange}
                  className={!validPin ? "invalid-input" : ""}
                />
                {!validPin && formFields.pinCode.length > 0 && (
                  <div className="error-message">INVALID</div>
                )}
              </label>
              {localities.length > 0 && (
                <label>
                  Locality <span className="compulsory">*</span>
                  <select
                    name="locality"
                    value={formFields.locality}
                    onChange={(e) => {
                      const selected = localities.find(
                        (loc) => loc.Name === e.target.value
                      );
                      setFormFields((prev) => ({
                        ...prev,
                        locality: e.target.value,
                        city: selected?.District || "",
                        state: selected?.State || "",
                      }));
                    }}
                  >
                    <option value="">Select Locality</option>
                    {localities.map((loc, index) => (
                      <option key={index} value={loc.Name}>
                        {loc.Name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="form-row">
              <label>
                City <span className="compulsory">*</span>
                <input type="text" name="city" value={formFields.city} readOnly />
              </label>
              <label>
                State <span className="compulsory">*</span>
                <input type="text" name="state" value={formFields.state} readOnly />
              </label>
            </div>
            <label>
              Phone <span className="compulsory">*</span>
              <input
                type="text"
                name="phone"
                value={formFields.phone}
                onChange={handleChange}
                className={!validPhone ? "invalid-input" : ""}
              />
              {!validPhone && formFields.phone.length > 0 && (
                <div className="error-message">INVALID</div>
              )}
            </label>
          </form>
        </div>

        {/* Payment Section */}
        <div className="section payment">
          <h2>Payment</h2>
          <p>All transactions are secure and encrypted.</p>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" defaultChecked />
              Razorpay Secure (Pay with UPI, Cards, Net Banking, etc.)
            </label>
            <div className="payment-description">
              <p>
                After clicking “Pay now,” you will be redirected to Razorpay Secure to complete your purchase securely.
              </p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="billing-address">
            <h3>Billing Address</h3>
            <label>
              <input
                type="radio"
                name="billing"
                value="same"
                defaultChecked
                onChange={handleBillingAddressChange}
              />
              Same as shipping address
            </label>
            <label>
              <input
                type="radio"
                name="billing"
                value="different"
                onChange={handleBillingAddressChange}
              />
              Use a different billing address
            </label>
            {!billingSameAsShipping && (
              <div className="billing-details">
                <label>
                  Billing Address
                  <input
                    type="text"
                    placeholder="Billing Address"
                    name="billingAddress"
                    value={formFields.billingAddress}
                    onChange={handleChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="pay-now"
        onClick={() => {
          if (!razorpayLoaded || !isFormValid) {
            alert("Can't proceed: Razorpay not loaded or form invalid.");
            return;
          }
          handlePayment();
        }}
      >
        {razorpayLoaded ? "Pay now" : "Loading Payment..."}
      </button>
    </div>
  );
};

export default Checkout;
