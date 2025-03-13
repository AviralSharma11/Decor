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
import LoginModal from "./Components/LoginModal";

export default function Collections() {
  const [filters] = useState(initialFilters);
  const [products] = useState(initialProducts);
  const [filtersKey, setFiltersKey] = useState(0);
  const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return localStorage.getItem("isAuthenticated") === "true"; // Check login status
    });
  
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
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
  
      // Filter by Type
      if (selectedFilters.Type.length > 0) {
        if (!product.type || !selectedFilters.Type.includes(product.type)) {
          return false;
        }
      }
  
      // Filter by Price
      if (selectedFilters.Price.length > 0) {
        const priceMatches = selectedFilters.Price.some((range) => {
          if (range === "Under ₹1,000") return product.discountedPrice < 1000;
          if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
          if (range === "Above ₹3,000") return product.discountedPrice > 3000;
          return false;
        });
  
        if (!priceMatches) {
          console.log(`Skipping ${product.name} because Price doesn't match.`);
          return false;
        }
      }
  
      return true;
    });
  };
  

  const filteredProducts = applyFilters();

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

  const resetFilters = () => {
  
    filters.forEach((filter) => {
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false));
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };
  

const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'), // Assuming email is stored in localStorage
          productId,
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
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          productId,
          quantity: newQuantity,
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
    <div className="Collections">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
      <Categories />
      
      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
          <button className="filter-btn filter2" onClick={resetFilters}>Reset Filters</button>
        </div>
      )}

      <FilterComponent2 
        key={filtersKey} 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedFilters={selectedFilters}
      />


      <div className="product">
        <div className="sidebar">
          <FilterComponent filters={filters} onFilterChange={handleFilterChange}  selectedFilters={selectedFilters}/>
          <button className="filter-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
        
        <div className="contents">
        <ProductComponent
          products={filteredProducts}
          addToCart={addToCart}
          isAuthenticated={isAuthenticated}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
        </div>
      </div>

      <SocialMediaBadges />
      <Footer />

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={() => {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            setIsLoginModalOpen(false); // Close modal after login
          }}
        />
      )}


    </div>
  );
}
