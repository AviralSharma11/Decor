import React, { useState, useEffect ,useCallback } from "react";
import axios from "axios";
// import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useParams, Link } from "react-router-dom";
import ProductComponent from "../Components/ProductComponent";
import { filters as initialFilters } from "../List/filter";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import FilterComponent from "../Components/FilterComponent";
import FilterComponent2 from "../Components/FilterComponent2";
import SocialMediaBadges from "../Components/SocialMediaBadges";
import LoginModal from "../Components/LoginModal";
import "@splidejs/splide/css";
import "../Styles/MaterialPage.css";

const DynamicCategory = () => {
  const { category } = useParams(); 
  const [filters] = useState(initialFilters);
  const [filtersKey, setFiltersKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ Type: [], Color: [], Price: [] });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    });
  
    useEffect(() => {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) setUser({ email: storedEmail });
    }, []);

//   const categories = [
//   {
//     name: "Themes",
//     key: "theme", 
//     image: "/Images/bythemes.jpg",
//     subcategories: [
//       { name: "Earthy", subcategory: "Earthy" },
//       { name: "Modern Minimilast", subcategory: "ModernMinimilast" },
//       { name: "Office Essential", subcategory: "OfficeEssentials" },
//       { name: "Safari", subcategory: "Safari" },
//       { name: "Wellness", subcategory: "Wellness" },
//       // ...
//     ],
//   },
//   {
//     name: "Styles",
//     key: "style",
//     image: "/Images/bystyles.jpg",
//     subcategories: [
//       { name: "Modern", subcategory: "Modern" },
//       { name: "Bohemian", subcategory: "Bohemian" },
//       { name: "Traditional", subcategory: "Traditional" },
//       { name: "Vintage", subcategory: "Vintage" },
//       { name: "Transitional", subcategory: "Transitional" },
//     ],
//   },
//   {
//     name: "Material",
//     key: "material",
//     image: "/Images/bymaterial.jpg",
//     subcategories: [
//       { name: "Wood", subcategory: "Wood" },
//       { name: "Acrylic", subcategory: "Acrylic" },
//       { name: "Resins", subcategory: "Resins" },
//       { name: "Cotton", subcategory: "Cotton" },
//       { name: "Glass", subcategory: "Glass" },
//       { name: "Metal", subcategory: "Metal" },
//       { name: "Gold", subcategory: "Gold" },
//     ],
//   },
//   {
//     name: "Trends",
//     key: "trending",
//     image: "/Images/bytrend.jpg",
//     subcategories: [
//       { name: "Coquette", subcategory: "Coquette" },
//       { name: "Dopamine", subcategory: "Dopamine" },
//       { name: "Soft Girl Aesthetic", subcategory: "SoftGirlAesthetic" },
//     ],
//   },

// ];


useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/collections/${category}`);

      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setError(null);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setError("No products found.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [category]);


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
    if (selectedFilters.Type.length > 0) {
      if (!product.type || !product.type.some((type) => selectedFilters.Type.includes(type))) {
        return false;
      }
    }
    if (selectedFilters.Color.length > 0 && !selectedFilters.Color.includes(product.color)) {
      return false;
    }
    if (selectedFilters.Price.length > 0) {
      const price = product.discountedPrice;
      const priceMatch = selectedFilters.Price.some((range) => {
        if (range === "Under ₹1,000") return price < 1000;
        if (range === "₹1,000 - ₹3,000") return price >= 1000 && price <= 3000;
        if (range === "Above ₹3,000") return price > 3000;
        return false;
      });
      if (!priceMatch) return false;
    }
    return true;
  });
}, [products, selectedFilters]);

useEffect(() => {
  const filtered = applyFilters();
  setFilteredProducts(filtered);
}, [applyFilters]);



  const resetFilters = () => {
    filters.forEach((filter) => {
      filter.options.forEach((option) => handleFilterChange(filter.label, option, false));
    });
    setFiltersKey((prev) => prev + 1);
  };

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    const updatedCart = cart.some((item) => item.id === product.id)
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    await fetch("http://localhost:5000/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId }),
    });
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await fetch("http://localhost:5000/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: localStorage.getItem("userEmail"), productId, quantity }),
    });
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const formatTitle = (str) => str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="material-page">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />

      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <Link to={`/collections/${category}`}><strong>Shop By {formatTitle(category)}</strong></Link>
      </nav>
    

      {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
          <button className="filter-btn filter2" onClick={resetFilters}>Reset Filters</button>
        </div>
      )}

            {/* Upper wave */}
      {/* <div className="slider-wave">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 804 50.167"
          preserveAspectRatio="none"
        >
         <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
              <stop offset="30%" stopColor="#4a4a4a" />
              <stop offset="100%" stopColor="#333" />
            </radialGradient>
          </defs>
          <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
        </svg>
      </div> */}

      {/* Splide Carousel */}
      {/* <div className="sliders">
      <Splide
        className="screen"
        options={{
          type: "loop",
          rewind: true,
          perPage: 4,
          focus: "center",
          autoplay: true,
          interval: 3000,
          pauseOnHover: false,
          pagination: false,
          arrows: true,
          breakpoints: {
            1024: { perPage: 3 },
            768: { perPage: 2 },
            480: { perPage: 1 },
          },
        }}
      >
        {categories.map((category, index) => (
          <SplideSlide key={index}>
            <div className="slide">
              <img src={category.image} alt={category.name} className="curved-image" />
              <p className="category-name">{category.name}</p>
              
              <div className="subcategory-links">
                {category.subcategories.map((sub, idx) => (
                  <Link
                    key={idx}
                    to={`/collections/${category.key}/${sub.subcategory}`}
                    className="subcategory-link"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Lower wave */}
      {/* <div className="slider-wave2">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 804 50.167"
          preserveAspectRatio="none"
        >
           <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
              <stop offset="30%" stopColor="#4a4a4a" />
              <stop offset="100%" stopColor="#333" />
            </radialGradient>
          </defs>
          <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
        </svg>
      </div>
      </div> */} 

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
            <p className="loading">Loading products...</p>
          ) : error ? (
            <p className="error">{error}</p>
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

export default DynamicCategory;

