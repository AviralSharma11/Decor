import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ProductComponent from "../Components/ProductComponent";
import { filters as initialFilters } from "../List/filter";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import FilterComponent from "../Components/FilterComponent";
import FilterComponent2 from "../Components/FilterComponent2";
import SocialMediaBadges from "../Components/SocialMediaBadges";
import LoginModal from "../Components/LoginModal";
import "../Styles/MaterialPage.css";

const DynamicSubcategoryPage = () => {
  const { category, subcategory } = useParams();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [filters] = useState(initialFilters);
  const [selectedFilters, setSelectedFilters] = useState({ Type: [], Color: [], Price: [] });
  const [filtersKey, setFiltersKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUser({ email: storedEmail });
  }, []);

  useEffect(() => {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const formattedSubcategory = subcategory.replace(/-/g, ' ').toLowerCase();

  fetch(`http://localhost:5000/api/products/collections/${formattedCategory}/${formattedSubcategory}`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Expected an array but got:", data);
        setProducts([]);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    });
}, [category, subcategory]);



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleFilterChange = (filterCategory, value, isChecked) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (isChecked) {
        updated[filterCategory] = [...updated[filterCategory], value];
      } else {
        updated[filterCategory] = updated[filterCategory].filter((item) => item !== value);
      }
      return updated;
    });
  };

  const applyFilters = useCallback(() => {
  if (!Array.isArray(products)) return [];
  return products.filter((product) => {
    if (
      selectedFilters.Type.length > 0 &&
      (!product.type || !product.type.some((type) => selectedFilters.Type.includes(type)))
    ) return false;

    if (
      selectedFilters.Color.length > 0 &&
      !selectedFilters.Color.includes(product.color)
    ) return false;

    if (selectedFilters.Price.length > 0) {
      const match = selectedFilters.Price.find((range) => {
        if (range === "Under ₹1,000") return product.discountedPrice < 1000;
        if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
        if (range === "Above ₹3,000") return product.discountedPrice > 3000;
        return false;
      });
      if (!match) return false;
    }

    return true;
  });
}, [selectedFilters, products]);

  

  const resetFilters = () => {
    filters.forEach((filter) =>
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false))
    );
    setFiltersKey((prev) => prev + 1);
  };

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const updatedCart = existing
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
        }),
      });
      if (res.ok) {
        setCart((prev) => {
          const updated = prev.filter((item) => item.id !== productId);
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
          quantity: newQuantity,
        }),
      });
      if (res.ok) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  const filteredProducts = applyFilters();
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedSubcategory = subcategory.replace(/-/g, ' ');

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <Link to={`/collections/${category}`}>By {formattedCategory}</Link> &gt;
        <span>{formattedSubcategory}</span>
      </nav>

      <h2 className="material-heading">{formattedSubcategory} Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of {formattedSubcategory.toLowerCase()} style products.
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
          {filteredProducts.length > 0 ? (
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

export default DynamicSubcategoryPage;
