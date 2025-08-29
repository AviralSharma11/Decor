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

const FamilyPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser({ email: storedEmail });
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://72.60.97.97:5000/api/products");
        const data = await res.json();
        const familyProducts = data.filter(product =>
          product.giftingguide?.includes("Family")
        );
        setProducts(familyProducts);
        setFilteredProducts(familyProducts);
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

  useEffect(() => {
    const applyFilters = () => {
      return products.filter((product) => {
        if (selectedFilters.Type.length > 0 &&
          (!product.type || !product.type.some(type => selectedFilters.Type.includes(type)))) {
          return false;
        }

        if (selectedFilters.Price.length > 0) {
          const matchesPrice = selectedFilters.Price.some((range) => {
            if (range === "Under ₹1,000") return product.discountedPrice < 1000;
            if (range === "₹1,000 - ₹3,000") return product.discountedPrice >= 1000 && product.discountedPrice <= 3000;
            if (range === "Above ₹3,000") return product.discountedPrice > 3000;
            return false;
          });

          if (!matchesPrice) return false;
        }

        return true;
      });
    };

    const updatedFiltered = applyFilters();
    setFilteredProducts(updatedFiltered);
  }, [selectedFilters, products]);

  const resetFilters = () => {
    filters.forEach((filter) => {
      filter.options.forEach((option) =>
        handleFilterChange(filter.label, option, false)
      );
    });
    setFiltersKey((prevKey) => prevKey + 1);
  };

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
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

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("http://72.60.97.97:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart((prev) => {
          const updated = prev.filter((item) => item.id !== productId);
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
        console.log(data.message);
      } else {
        console.error("Failed to remove from cart:", data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("http://72.60.97.97:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      console.log(data.message);

      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  return (
    <div className="material-page">
      <Header
        cart={cart}
        onRemoveFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        user={user}
        products={products}
      />

      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <span>For Family</span>
      </nav>

      <h2 className="material-heading">The Family Collection</h2>
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

      <div className="product">
        <div className="sidebar">
          <FilterComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
          <button className="filter-btn" onClick={resetFilters}>Reset Filters</button>
        </div>

        <div className="contents">
          {loading ? (
            <p>Loading products...</p>
          ) : fetchError ? (
            <p className="error-message">{fetchError}</p>
          ) : filteredProducts.length > 0 ? (
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

export default FamilyPage;
