import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../../Styles/MaterialPage.css";
import ProductComponent from "../../ProductComponent";
import { filters as initialFilters } from "../../../List/filter";
import Header from "../../Header";
import Footer from "../../Footer";
import FilterComponent from "../../FilterComponent";
import FilterComponent2 from "../../FilterComponent2";
import SocialMediaBadges from "../../SocialMediaBadges";
import LoginModal from "../../LoginModal";
import { API_BASE_URL } from "../../../api/config";

const FriendsPage = () => {
  const [products, setProducts] = useState([]);
  const [filters] = useState(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
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
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        const friendsProducts = data.filter(product => product.giftingguide?.includes("Friends"));
        setProducts(friendsProducts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setFetchError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterCategory, value, isChecked) => {
    setSelectedFilters((prevFilters) => {
      const updated = { ...prevFilters };
      if (isChecked) {
        updated[filterCategory] = [...updated[filterCategory], value];
      } else {
        updated[filterCategory] = updated[filterCategory].filter(item => item !== value);
      }
      return updated;
    });
  };

  const applyFilters = () => {
    return products.filter(product => {
      if (selectedFilters.Type.length > 0) {
        if (!product.type || !product.type.some(type => selectedFilters.Type.includes(type))) return false;
      }
      if (selectedFilters.Price.length > 0) {
        const matches = selectedFilters.Price.some(range => {
          if (range === "Under ₹1,000") return product.discountedPrice < 1000;
          if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
          if (range === "Above ₹3,000") return product.discountedPrice > 3000;
          return false;
        });
        if (!matches) return false;
      }
      return true;
    });
  };

  const filteredProducts = applyFilters();

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

  const resetFilters = () => {
    filters.forEach(filter =>
      filter.options.forEach(option =>
        handleFilterChange(filter.label, option, false)
      )
    );
    setFiltersKey(prev => prev + 1);
  };

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />

      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <span>For Friends</span>
      </nav>

      <h2 className="material-heading">The Friends Collection</h2>
      <p className="material-description">
        Discover our curated gifts to celebrate your best friendships.
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
          <FilterComponent filters={filters} onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
          <button className="filter-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
        <div className="contents">
          {loading ? (
            <p>Loading products...</p>
          ) : fetchError ? (
            <p className="no-products">{fetchError}</p>
          ) : filteredProducts.length > 0 ? (
            <ProductComponent products={filteredProducts} addToCart={addToCart} isAuthenticated={isAuthenticated} setIsLoginModalOpen={setIsLoginModalOpen} />
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
            setIsLoginModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default FriendsPage;
