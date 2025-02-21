import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Styles/MaterialPage.css"; 
import ProductComponent from "../ProductComponent";
import { filters as initialFilters, products as allProducts } from "../../List/product"; 
import Header from "../Header";
import Footer from "../Footer";
import FilterComponent from "../FilterComponent";
import FilterComponent2 from "../FilterComponent2";
import SocialMediaBadges from "../SocialMediaBadges";

const ResinsMaterialPage = () => {
  // Filter only wood products
  const resinsProducts = allProducts.filter((product) => product.material === "Resins");

  // Use woodProducts as initial products state
  const [filters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  useEffect(() => {
    if (cart.length > 0) {  // Prevent overwriting with an empty array on first load
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });
 const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Handle filter changes
  const handleFilterChange = (filterCategory, value, isChecked) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (isChecked) {
        updatedFilters[filterCategory] = [...updatedFilters[filterCategory], value];
      } else {
        updatedFilters[filterCategory] = updatedFilters[filterCategory].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  // Apply selected filters (now only applies to wood products)
  const applyFilters = () => {
    return resinsProducts.filter((product) => {
      // Filter by Type
      if (
        selectedFilters.Type.length > 0 &&
        !selectedFilters.Type.includes(product.name.split(" ")[0])
      ) {
        return false;
      }

      // Filter by Color
      if (selectedFilters.Color.length > 0 && !selectedFilters.Color.includes(product.color)) {
        return false;
      }

      // Filter by Price
      if (selectedFilters.Price.length > 0) {
        const priceRange = selectedFilters.Price.find((range) => {
          if (range === "Under ₹1,000") return product.discountedPrice < 1000;
          if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
          if (range === "Above ₹3,000") return product.discountedPrice > 3000;
          return false;
        });

        if (!priceRange) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredProducts = applyFilters();

  // Add product to cart
  const addToCart = (product) => {
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

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
      return updatedCart;
    });
  };

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
      return updatedCart;
    });
  };

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <Link to="/collections/material">By Material</Link> &gt;
        <span>Resin</span>
      </nav>

      <h2 className="material-heading">Resin Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of resins products, crafted with elegance and durability.
      </p>
      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
        </div>
      )}

      <FilterComponent2 filters={filters} onFilterChange={handleFilterChange} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Display Products */}
      <div className="product">
        <div className="sidebar">
          <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <div className="contents">
          {filteredProducts.length > 0 ? (
            <ProductComponent products={filteredProducts} addToCart={addToCart} />
          ) : (
            <p className="no-products">No products match your selected filters.</p>
          )}
        </div>
      </div>

      <SocialMediaBadges />
      <Footer />
    </div>
  );
};

export default ResinsMaterialPage;
