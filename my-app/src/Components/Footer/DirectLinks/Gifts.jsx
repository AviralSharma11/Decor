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

const Gifts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filters] = useState(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
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
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const giftOnly = data.filter((product) => product.gift === 1 || product.gift === true);
        setAllProducts(giftOnly);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilterChange = (filterCategory, value, isChecked) => {
    setSelectedFilters((prevFilters) => {
      const updated = { ...prevFilters };
      if (isChecked) {
        updated[filterCategory] = [...updated[filterCategory], value];
      } else {
        updated[filterCategory] = updated[filterCategory].filter((item) => item !== value);
      }
      return updated;
    });
  };

  const applyFilters = () => {
    return allProducts.filter((product) => {
      if (
        selectedFilters.Type.length > 0 &&
        (!product.name || !selectedFilters.Type.includes(product.name.split(" ")[0]))
      ) return false;

      if (
        selectedFilters.Color.length > 0 &&
        (!product.color || !selectedFilters.Color.includes(product.color))
      ) return false;

      if (selectedFilters.Price.length > 0) {
        const match = selectedFilters.Price.some((range) => {
          if (!product.discountedPrice) return false;
          if (range === "Under ₹1,000") return product.discountedPrice < 1000;
          if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
          if (range === "Above ₹3,000") return product.discountedPrice > 3000;
          return false;
        });
        if (!match) return false;
      }

      return true;
    });
  };

  const filteredProducts = applyFilters();

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
      const updated = existing
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId }),
      });

      if (res.ok) {
        setCart((prev) => {
          const updated = prev.filter((item) => item.id !== productId);
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId, quantity: newQuantity }),
      });

      if (res.ok) {
        setCart((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={allProducts} />

      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <span>Gifts</span>
      </nav>

      <h2 className="material-heading">Gift Collection</h2>
      <p className="material-description">
        Discover our beautiful collection of gifts, crafted with care and creativity.
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
            <ProductComponent
              products={filteredProducts}
              addToCart={addToCart}
              isAuthenticated={isAuthenticated}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
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

export default Gifts;
