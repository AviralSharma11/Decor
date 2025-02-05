import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import Categories from "./Components/Collections/Categories";
import FilterComponent from "./Components/FilterComponent";
import FilterComponent2 from "./Components/FilterComponent2";
import ProductComponent from "./Components/ProductComponent";
import { filters as initialFilters, products as initialProducts } from "./List/product";
import "./Collections.css";

export default function Collections() {
  const [filters] = useState(initialFilters);
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const applyFilters = () => {
    return products.filter((product) => {
      if (selectedFilters.Type.length > 0 && !selectedFilters.Type.includes(product.name.split(" ")[0])) {
        return false;
      }
      if (selectedFilters.Color.length > 0 && !selectedFilters.Color.includes(product.color)) {
        return false;
      }
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

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  return (
    <div className="Collections">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
      <Categories />
      
      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
        </div>
      )}

      <FilterComponent2 filters={filters} onFilterChange={handleFilterChange} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="product">
        <div className="sidebar">
          <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="contents">
          <ProductComponent products={filteredProducts} addToCart={addToCart} />
        </div>
      </div>

      <SocialMediaBadges />
      <Footer />
    </div>
  );
}
