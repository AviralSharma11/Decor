import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import "../../../Styles/MaterialPage.css"; 
import ProductComponent from "../../ProductComponent";
import { filters as initialFilters, products as allProducts } from "../../../List/product"; 
import Header from "../../Header";
import Footer from "../../Footer";
import FilterComponent from "../../FilterComponent";
import FilterComponent2 from "../../FilterComponent2";
import SocialMediaBadges from "../../SocialMediaBadges";

const HERPage = () => {
  // Filter only HIM products
  const HERProducts = allProducts.filter((product) => product.giftingguide === "HER");

  // Use HIM as initial products state
  const [filters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersKey, setFiltersKey] = useState(0);
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

  const applyFilters = () => {
    return HERProducts.filter((product) => {
  
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

  const resetFilters = () => {
  
    filters.forEach((filter) => {
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false));
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };
  
  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <span>For HER</span>
      </nav>

      <h2 className="material-heading">The HER Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of wooden products, crafted with elegance and durability.
      </p>
      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
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

      {/* Display Products */}
      <div className="product">
        <div className="sidebar">
          <FilterComponent filters={filters} onFilterChange={handleFilterChange} selectedFilters={selectedFilters}/>
          <button className="filter-btn" onClick={resetFilters}>Reset Filters</button>
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

export default HERPage;
