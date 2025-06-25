import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import "../../Styles/MaterialPage.css"; 
import ProductComponent from "../ProductComponent";
import { filters as initialFilters, products as allProducts } from "../../List/product"; 
import Header from "../Header";
import Footer from "../Footer";
import FilterComponent from "../FilterComponent";
import FilterComponent2 from "../FilterComponent2";
import SocialMediaBadges from "../SocialMediaBadges";
import LoginModal from "../LoginModal";

const Traditional = () => {
  // Filter only wood products
  const traditionalProducts = allProducts.filter(
    (product) => Array.isArray(product.style) && product.style.includes("Traditional")
  );

  // Use acrylicProducts as initial products state
  const [filters] = useState(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
      const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
      const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true"; // Check login status
      });  
          const [user, setUser] = useState(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
          });
          
            useEffect(() => {
              const storedEmail = localStorage.getItem("userEmail");
              if (storedEmail) {
                setUser({ email: storedEmail });
              }
            }, []);
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
    return traditionalProducts.filter((product) => {
      // Filter by Type
      if (selectedFilters.Type.length > 0) {
        if (!product.type || !product.type.some(type => selectedFilters.Type.includes(type))) {
          return false;
        }
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

  const resetFilters = () => {
  
    filters.forEach((filter) => {
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false));
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };

  // Add product to cart
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

  // Remove product from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/remove`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/update`, {
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
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={allProducts}/>

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <Link to="/collections/style">By Styles</Link> &gt;
        <span>Traditional</span>
      </nav>

      <h2 className="material-heading">Traditional Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of traditional style products, crafted with elegance and durability.
      </p>
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
          {filteredProducts.length > 0 ? (
            <ProductComponent products={filteredProducts} addToCart={addToCart} isAuthenticated={isAuthenticated} setIsLoginModalOpen={setIsLoginModalOpen}/>
          ) : (
            <p className="no-products">No products match your selected filters.</p>
          )}
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
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Traditional;
