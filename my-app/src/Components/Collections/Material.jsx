import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "../../Styles/Collection/Categories.css";
import Header from "../Header";
import Footer from "../Footer";
import SocialMediaBadges from "../SocialMediaBadges";
import ProductComponent from "../ProductComponent";
import FilterComponent from "../FilterComponent";
import FilterComponent2 from "../FilterComponent2";
import { filters as initialFilters } from "../../List/filter";
import "../../Collections.css";
import LoginModal from "../LoginModal";

export default function Material() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters] = useState(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    Color: [],
    Price: [],
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setProducts(data); // Start with full list
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUser({ email: storedEmail });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = () => {
    return allProducts.filter((product) => {
      if (selectedFilters.Type.length > 0 && (!product.type || !selectedFilters.Type.some(t => product.type.includes(t)))) {
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
        if (!priceRange) return false;
      }
      return true;
    });
  };

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
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const updated = exists
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId })
      });
      if (res.ok) {
        setCart((prev) => {
          const updated = prev.filter((item) => item.id !== productId);
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1 || !isAuthenticated) return;
    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId, quantity }),
      });
      if (res.ok) {
        setCart((prev) =>
          prev.map((item) => item.id === productId ? { ...item, quantity } : item)
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const material = [
    { name: "WOOD", image: "/Images/bytrend.jpg", link: "/material/wood" },
    { name: "ACRYLIC", image: "/Images/bystyles.jpg", link: "/material/acrylic" },
    { name: "RESINS", image: "/Images/bymaterial.jpg", link: "/material/resins" },
    { name: "CERAMICS", image: "/Images/bythemes.jpg", link: "/material/ceramics" },
  ];

  const filteredProducts = applyFilters();

  return (
    <div className="material">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />
      <div className="carousel-container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> &gt;
          <Link to="/collections"> Collections</Link> &gt;
          <Link to="/collections/material"> <strong>Shop By Materials</strong></Link>
        </nav>

        <div className="slider-wave">
          <svg viewBox="0 0 804 50.167"><path fill="#333" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/></svg>
        </div>

        <div className="sliders">
          <Splide className="screen" options={{
            type: "loop", perPage: 4, focus: "center", autoplay: true, interval: 3000,
            pauseOnHover: false, pagination: false, arrows: true,
            breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2 }, 480: { perPage: 1 } }
          }}>
            {material.map((cat, idx) => (
              <SplideSlide key={idx}>
                <Link to={cat.link} className="slide">
                  <img src={cat.image} alt={`Slide ${idx + 1}`} className="curved-image" />
                </Link>
                <p className="category-name">{cat.name}</p>
              </SplideSlide>
            ))}
          </Splide>

          <div className="slider-wave2">
            <svg viewBox="0 0 804 50.167"><path fill="#333" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/></svg>
          </div>
        </div>
      </div>

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
          <ProductComponent products={filteredProducts} addToCart={addToCart} isAuthenticated={isAuthenticated} setIsLoginModalOpen={setIsLoginModalOpen} />
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
}
