import React, { useState , useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/Checkout.css";

const Checkout = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "", 
  });
  
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []); 
  
  useEffect(() => {
    const allFieldsFilled = Object.values(formFields).every((value) => value.trim() !== "");
    const validPin = /^[1-9][0-9]{5}$/.test(formFields.pinCode);
    const validPhone = /^[6-9]\d{9}$/.test(formFields.phone);
  
    console.log("Fields:", formFields);
    console.log("All fields filled:", allFieldsFilled);
    console.log("Valid PIN:", validPin);
    console.log("Valid phone:", validPhone);
  
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


  const handlePayment = async () => {
    console.log("handlePayment called");
    try {
      const response = await fetch("http://localhost:5000/api/razorpay-key");
      console.log("api response", response)
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.key) {
        throw new Error("Razorpay key not received from backend");
      }
      const fullName = `${formFields.firstName} ${formFields.lastName}`;
      const email = localStorage.getItem("userEmail") || "aviral@example.com";
  
      const options = {
        key: data.key,
        amount: productPrice * 100, // in paise
        currency: "INR",
        name: "OceanWays",
        description: productName,
        // image: "https://your-logo-url.com/logo.png",
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: fullName,
          email: email,
          contact: formFields.phone,
        },
        theme: {
          color: "#3399cc",
        },
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
      {/* Delivery Section */}
      <div className="format">
        <div className="section delivery">
          <h2>Delivery</h2>
          <form>
            <label>
              Country/Region
              <span className="compulsory">*</span>
              <select>
                <option value="India">India</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                First Name
                <span className="compulsory">*</span>
                <input type="text" name="firstName" placeholder="First name"  value={formFields.firstName}  onChange={handleChange} />
              </label>
              <label>
                Last Name
                <span className="compulsory">*</span>
                <input type="text" name="lastName" placeholder="Last name" value={formFields.lastName}  onChange={handleChange}/>
              </label>
            </div>
            <label>
              Address
              <span className="compulsory">*</span>
              <input type="text" name="address" placeholder="Address" value={formFields.address}   onChange={handleChange}/>
            </label>
            <label>
              Apartment, suite, etc. (Optional)
              <input type="text" placeholder="Apartment, suite, etc." />
            </label>
            <div className="form-row">
              <label>
                City
                <span className="compulsory">*</span>
                <input type="text" name="city" placeholder="City" value={formFields.city}  onChange={handleChange} />
              </label>
              <label>
                State
                <span className="compulsory">*</span>
                <select name="state" value={formFields.state} onChange={handleChange} required>
                  <option value="">Select State/UT</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                </select>
              </label>
              <label>
                PIN Code
                <span className="compulsory">*</span>
                <input
                  type="text"
                  name="pinCode"
                  placeholder="PIN code"
                  value={formFields.pinCode}
                  className={!validPin ? "invalid-input" : ""}
                  onChange={handleChange}
                />
                {!validPin && formFields.pinCode.length > 0 && (
                  <div className="error-message">INVALID</div>
                )}
              </label>

            </div>
           <label>
              Phone
              <span className="compulsory">*</span>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formFields.phone}
                className={!validPhone ? "invalid-input" : ""}
                onChange={handleChange}
              />
              {!validPhone && formFields.phone.length > 0 && (
                <div className="error-message">INVALID</div>
              )}
            </label>

            {/* <label>
              <input type="checkbox" /> Save this information for next time
            </label> */}
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
                After clicking “Pay now,” you will be redirected to Razorpay
                Secure to complete your purchase securely.
              </p>
            </div>
            {/* <label>
              <input type="radio" name="payment" />
              Credit Cards, Debit Cards
            </label>
            <label>
              <input type="radio" name="payment" />
              Simpl PayLater & Pay in 3 Installments | 0% Interest
            </label>
            <label>
              <input type="radio" name="payment" />
              CRED Pay (Rewards on UPI, Cards, etc.)
            </label> */}
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

      {/* Pay Now Button */}
      <button
  className="pay-now"
  onClick={() => {
    console.log("razorpayLoaded:", razorpayLoaded);
    console.log("isFormValid:", isFormValid);
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
//check this