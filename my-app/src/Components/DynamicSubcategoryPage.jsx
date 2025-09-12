import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import SocialMediaBadges from "./SocialMediaBadges";
import Footer from "./Footer";
import FilterComponent from "./FilterComponent";
import FilterComponent2 from "./FilterComponent2";
import ProductComponent from "./ProductComponent";
import { filters as initialFilters } from "../List/filter";
import LoginModal from "./LoginModal";
import "../Collections.css";
import "../Styles/DynamicPage.css";
import { API_BASE_URL } from "../api/config";

export default function DynamicSubcategoryPage() {
  const { category, subcategory } = useParams(); // Get category from URL

  const [filters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [filtersKey, setFiltersKey] = useState(0);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch products for the category from backend
useEffect(() => {
  if (!category || !subcategory) return;

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`
      );
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]); // fallback
    }
  };

  fetchProducts();
}, [category, subcategory]);




  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }
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
    const productList = Array.isArray(products) ? products : [];
    return productList.filter((product) => {
      let types = [];
      let rawType = product.type || product.category || product.subcategory || "";

      if (Array.isArray(rawType)) {
        types = rawType;
      } else if (typeof rawType === "string") {
        try {
          const parsed = JSON.parse(rawType);
          types = Array.isArray(parsed) ? parsed : [rawType];
        } catch {
          types = [rawType];
        }
      }

      if (selectedFilters.Type.length > 0) {
        if (!types.some((type) => selectedFilters.Type.includes(type))) {
          return false;
        }
      }

      const price = Number(
        product.discountedPrice ||
          product.price ||
          product.originalPrice ||
          0
      );

      if (selectedFilters.Price.length > 0) {
        const priceMatches = selectedFilters.Price.some((range) => {
          if (range === "Under ₹1,000") return price < 1000;
          if (range === "₹1,000 - ₹3,000") return price >= 1000 && price <= 3000;
          if (range === "Above ₹3,000") return price > 3000;
          return false;
        });

        if (!priceMatches) return false;
      }

      return true;
    });
  };

  const filteredProducts = applyFilters();

   // Add product to cart
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
    filters.forEach((filter) => {
      filter.options.forEach((option) =>
        handleFilterChange(filter.label, option, false)
      );
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="Collections">
      <Header
        cart={cart}
        onRemoveFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        user={user}
        products={products}
      />
      <nav className="breadcrumb" style={{marginTop: "124px"}}>
      <Link to="/">Home</Link> &gt;
      <Link to="/collections">Collections</Link> &gt;
      {category && (
        <>
          <Link to={`/collections/${category}`}>
            By {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
          {subcategory && (
            <>
              {">"}
              <Link to={`/collections/${category}/${subcategory}`}>
                <strong>{subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</strong>
              </Link>
            </>
          )}
        </>
      )}
    </nav>

      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>
            Filters
          </button>
          <button className="filter-btn filter2" onClick={resetFilters}>
            Reset Filters
          </button>
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
          <FilterComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
          <button className="filter-btn" onClick={resetFilters}>
            Reset Filters
          </button>
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
            setIsLoginModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
