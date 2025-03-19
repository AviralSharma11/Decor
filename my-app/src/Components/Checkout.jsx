import React, { useState } from "react";
import "../Styles/Checkout.css";

const Checkout = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const handleBillingAddressChange = (e) => {
    setBillingSameAsShipping(e.target.value === "same");
  };

  const handlePayment = async () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay API key
      amount: 10000, // Amount in paise (10000 paise = 100 INR)
      currency: "INR",
      name: "Your Company Name",
      description: "Purchase Description",
      image: "https://your-logo-url.com/logo.png", // Your logo URL
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        // You can store payment details in the database here
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

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
                <option value="US">United States</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                First Name
                <span className="compulsory">*</span>
                <input type="text" placeholder="First name" />
              </label>
              <label>
                Last Name
                <span className="compulsory">*</span>
                <input type="text" placeholder="Last name" />
              </label>
            </div>
            <label>
              Address
              <span className="compulsory">*</span>
              <input type="text" placeholder="Address" />
            </label>
            <label>
              Apartment, suite, etc. (Optional)
              <input type="text" placeholder="Apartment, suite, etc." />
            </label>
            <div className="form-row">
              <label>
                City
                <span className="compulsory">*</span>
                <input type="text" placeholder="City" />
              </label>
              <label>
                State
                <span className="compulsory">*</span>
                <select>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </label>
              <label>
                PIN Code
                <span className="compulsory">*</span>
                <input type="text" placeholder="PIN code" />
              </label>
            </div>
            <label>
              Phone
              <span className="compulsory">*</span>
              <input type="text" placeholder="Phone" />
            </label>
            <label>
              <input type="checkbox" /> Save this information for next time
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
                After clicking “Pay now,” you will be redirected to Razorpay
                Secure to complete your purchase securely.
              </p>
            </div>
            <label>
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
            </label>
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
                  <input type="text" placeholder="Billing Address" />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      <button className="pay-now" onClick={handlePayment}>
        Pay now
      </button>
    </div>
  );
};

export default Checkout;
