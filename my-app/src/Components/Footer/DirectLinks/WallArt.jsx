import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import "../../../Styles/MaterialPage.css"; 
import ProductComponent from "../../ProductComponent";
import {filters as initialFilters} from "../../../List/filter";
import Header from "../../Header";
import Footer from "../../Footer";
import FilterComponent from "../../FilterComponent";
import FilterComponent2 from "../../FilterComponent2";
import SocialMediaBadges from "../../SocialMediaBadges";
import LoginModal from "../../LoginModal";
import { API_BASE_URL } from "../../../api/config";

const WallArt = () => {
  const [allProducts, setAllProducts] = useState([]);
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
          

  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

     useEffect(() => {
       const storedEmail = localStorage.getItem("userEmail");
       if (storedEmail) setUser({ email: storedEmail });
   
       fetch(`${API_BASE_URL}/products`)
         .then((res) => res.json())
         .then((data) => {
           const wallartOnly = data.filter((product) => product.wallart === 1 || product.wallart === true);
           setAllProducts(wallartOnly);
         })
         .catch((err) => console.error("Failed to fetch products:", err));
     }, []);
  
    // Fetch cart from DB when user logs in
   useEffect(() => {
    const fetchCart = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/cart/${user.email}`);
        const data = await res.json();
        setCart(data);
        localStorage.setItem("cart", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
  
    fetchCart();
  }, [user?.email]);
  
  
    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // Helper to refresh cart from DB
    const refreshCart = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/${user.email}`);
        const data = await res.json();
        setCart(data);
        localStorage.setItem("cart", JSON.stringify(data)); // fallback
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
      }
    };

      useEffect(() => {
    if (cart.length > 0) {  // Prevent overwriting with an empty array on first load
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
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
    return allProducts.filter((product) => {
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

  const resetFilters = () => {
  
    filters.forEach((filter) => {
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false));
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };

  // Add product to cart
const addToCart = async (product) => {
      if (!isAuthenticated) {
        setIsLoginModalOpen(true);
        return;
      }

      const payload = {
        email: user.email || localStorage.getItem("userEmail"),
        productId: product.id,   // ✅ backend expects this
        productName: product.name,
        price: product.price || product.originalPrice || 0,
        discountedPrice: product.discountedPrice || null,
        image: product.image || null,  // array or string
        customText1: product.customText1 || null, // null for non-customizable
        uploadedPhoto: product.uploadedPhoto || null, // null for non-customizable
      };

      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        console.log("✅ Added to cart:", data.message);
        await refreshCart();
      } catch (err) {
        console.error("❌ Failed to add product:", err.message);
      }
    };
    
  // ✅ Remove product from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      console.log("✅ Removed from cart:", data.message);
      await refreshCart();
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
    }
  };

  // ✅ Update quantity in cart
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          productId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      console.log("✅ Updated quantity:", data.message);
      await refreshCart();
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
    }
  };

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={allProducts}/>

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <span>Wall Art</span>
      </nav>

      <h2 className="material-heading">Wall Art Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of Wall Art products, crafted with elegance and durability.
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

export default WallArt;
