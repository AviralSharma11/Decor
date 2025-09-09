import React, { useState, useEffect } from "react";
import "../../../Styles/HomePage/DIY.css";
import Header from "../../Header";
import Footer from "../../Footer";
import BestSeller from "../BestSeller";
import LoginModal from "../../LoginModal";
import ProductComponent from "../../ProductComponent";
import { API_BASE_URL } from "../../../api/config";

const DIY = () => {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    recipient: "",
    occasion: "",
    budget: "",
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUser({ email: storedEmail });
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const filterProducts = () => {
    const budget = parseInt(formData.budget);

    return products.filter((product) => {
      const rawRecipient = product.giftingguide || "";

      const productRecipient = Array.isArray(rawRecipient)
        ? rawRecipient.join(", ").toLowerCase()
        : String(rawRecipient).toLowerCase();

      const matchRecipient = productRecipient.includes(
        formData.recipient.toLowerCase()
      );
      const matchBudget = !isNaN(budget)
        ? product.discountedPrice <= budget
        : true;

      return matchRecipient && matchBudget;
    });
  };

  const suggestedProducts = filterProducts();

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
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          productId,
          customData: cart.find(item => item.id === productId)?.customData || {}
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
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          productId,
          quantity: newQuantity,
          customData: cart.find(item => item.id === productId)?.customData || {}
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
    <div>
      <Header
        cart={cart}
        onRemoveFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        user={user}
        products={products}
      />

      <div className="wizard-container">
        <h2 className="wizard-title">Custom Gifting Wizard</h2>

        <div className="wizard-step">
          {step === 1 && (
            <div className="wizard-input">
              <label>Who is it for?</label>
              <input
                type="text"
                name="recipient"
                placeholder="e.g. HER, HIM, Family, Friends, Office"
                value={formData.recipient}
                onChange={handleChange}
              />
            </div>
          )}

          {step === 2 && (
            <div className="wizard-input">
              <label>Occasion?</label>
              <input
                type="text"
                name="occasion"
                placeholder="e.g. Birthday, Anniversary"
                value={formData.occasion}
                onChange={handleChange}
              />
            </div>
          )}

          {step === 3 && (
            <div className="wizard-input">
              <label>Budget?</label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 1000, 2500"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          )}

          {step === 4 && (
            <div className="wizard-result">
              <h3>Gift Suggestions for {formData.recipient}</h3>
              {suggestedProducts.length > 0 ? (
                <div className="product-suggestions">
                  <ProductComponent
                    products={suggestedProducts}
                    addToCart={addToCart}
                    isAuthenticated={isAuthenticated}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                  />
                </div>
              ) : (
                <div className="product-suggestions">
                  <p>No matching gifts found. Showing top picks instead:</p>
                  <BestSeller />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="wizard-buttons">
          {step > 1 && step < 4 && (
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 4 && (
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={!formData[Object.keys(formData)[step - 1]]}
            >
              Next
            </button>
          )}
        </div>
      </div>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={() => {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            setIsLoginModalOpen(false);
            window.location.reload();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default DIY;
