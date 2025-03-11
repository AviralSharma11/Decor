import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Components/Header";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import Categories from "./Components/Collections/Categories";
import FilterComponent from "./Components/FilterComponent";
import FilterComponent2 from "./Components/FilterComponent2";
import ProductComponent from "./Components/ProductComponent";
import { filters as initialFilters, products as initialProducts } from "./List/product";
import "./Collections.css";
import LoginModal from "./Components/LoginModal";

export default function Collections() {
  const [filters] = useState(initialFilters);
  const [products] = useState(initialProducts);
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem("isAuthenticated") === "true"
  );

  const user = localStorage.getItem("userEmail");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user cart from backend
  const fetchCart = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${email}`);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Combined filter handling logic
  const handleFilterChange = (filterCategory, value, isChecked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterCategory]: isChecked
        ? [...prev[filterCategory], value]
        : prev[filterCategory].filter((item) => item !== value),
    }));
  };

  // Price filter mapping
  const priceRanges = {
    "Under ₹1,000": (price) => price < 1000,
    "₹1,000 - ₹3,000": (price) => price >= 1000 && price <= 3000,
    "Above ₹3,000": (price) => price > 3000,
  };

  // Apply filters to product list
  const applyFilters = () =>
    products.filter((product) =>
      (!selectedFilters.Type.length || selectedFilters.Type.includes(product.type)) &&
      (!selectedFilters.Price.length ||
        selectedFilters.Price.some((range) => priceRanges[range]?.(product.discountedPrice)))
    );

  const filteredProducts = applyFilters();

  // Add product to cart
  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setCart((prevCart) =>
      prevCart.some((item) => item.id === product.id)
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }]
    );
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user, productId }),
      });

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.id !== productId)
        );
      } else {
        console.error("Failed to remove from cart");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Update product quantity in cart
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user, productId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({
      Type: [],
      Color: [],
      Price: [],
    });
  };

  return (
    <div className="Collections">
      {/* Header */}
      <Header
        cart={cart}
        onRemoveFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        user={user}
      />

      {/* Categories */}
      <Categories />

      {/* Mobile filter controls */}
      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>
            Filters
          </button>
          <button
            className={`filter-btn ${
              Object.values(selectedFilters).flat().length === 0 ? "disabled" : ""
            }`}
            onClick={resetFilters}
            disabled={Object.values(selectedFilters).flat().length === 0}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Filter component (mobile) */}
      <FilterComponent2
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedFilters={selectedFilters}
      />

      {/* Main content */}
      <div className="product">
        {/* Sidebar filter */}
        <div className="sidebar">
          <FilterComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
          <button
            className={`filter-btn ${
              Object.values(selectedFilters).flat().length === 0 ? "disabled" : ""
            }`}
            onClick={resetFilters}
            disabled={Object.values(selectedFilters).flat().length === 0}
          >
            Reset Filters
          </button>
        </div>

        {/* Product grid */}
        <div className="contents">
          <ProductComponent
            products={filteredProducts}
            addToCart={addToCart}
            isAuthenticated={isAuthenticated}
            setIsLoginModalOpen={setIsLoginModalOpen}
          />
        </div>
      </div>

      {/* Social media + Footer */}
      <SocialMediaBadges />
      <Footer />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={() => {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            setIsLoginModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
