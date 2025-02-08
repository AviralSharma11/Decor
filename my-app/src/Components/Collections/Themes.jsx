import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "../../Styles/Collection/Categories.css";
import Header from "../Header";
import Footer from "../Footer";
import SocialMediaBadges from "../SocialMediaBadges";
import ProductComponent from "../ProductComponent";
import FilterComponent from "../FilterComponent";
import FilterComponent2 from "../FilterComponent2";
import { filters as initialFilters, products as initialProducts  } from "../../List/product";
import "../../Collections.css";

export default function Themes(){
    const [filters] = useState(initialFilters);
    const [products] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cart, setCart] = useState([]);
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
        return products.filter((product) => {
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
    
      // Add product to cart
      const addToCart = (product) => {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === product.id);
          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prevCart, { ...product, quantity: 1 }];
        });
      };
    
      // Remove product from cart
      const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      };
    
      const updateQuantity = (productId, newQuantity) => {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
          )
        );
      };

    const material = [
        { name: "MODERN MINIMALIST", image: "/Images/bytrend.jpg", link: "/themes/modern-minimalist"},
        { name: "NAUTICAL", image: "/Images/bystyles.jpg", link: "/themes/nautical"},
        { name: "BANJARA", image: "/Images/bymaterial.jpg", link: "/themes/banjara" },
        { name: "WELLNESS", image: "/Images/bythemes.jpg" , link: "/themes/wellness" },
        { name: "JUNGLE SAFARI", image: "/Images/bythemes.jpg", link: "/themes/jungle-safari"},
        { name: "EARTHY", image: "/Images/bytrend.jpg", link: "/themes/earthy"},
        { name: "OFFICE ESSENTIALS", image: "/Images/bystyles.jpg", link: "/themes/office-essentials"}
      ];
    return(
        <div className="material">
            <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <div className="carousel-container">
                {/* Breadcrumb Navigation */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> &gt;
                    <Link to="/collections"> Collections</Link> &gt;
                    <Link to="/collections/themes"> <strong>Shop By Themes</strong></Link>
                </nav>
            
                {/* Categories Section */}
                <div className="slider-wave">
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 804 50.167"
                      preserveAspectRatio="none"
                      xmlSpace="preserve"
                    >
                      <path
                        fill="#333"
                        d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"
                      />
                    </svg>
                  </div>
                <Splide
                  options={{
                    type: "loop",
                    perPage: 4,
                    focus: "center",
                    autoplay: true,
                    interval: 3000,
                    pauseOnHover: false,
                    pagination: false,
                    arrows: true,
                    breakpoints: {
                      768: { perPage: 1 },
                    },
                  }}
                >
                  {material.map((category, index) => (
                    <SplideSlide key={index}>
                      <Link to={category.link}>
                      <img src={category.image} alt={`Slide ${index + 1}`} className="curved-image" />
                      <p className="category-name">{category.name}</p>
                      </Link>
                    </SplideSlide>
                  ))}
                </Splide>
                <div className="slider-wave2 bottom">
                <svg
                  version="1.1"
                  id="Layer_1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  xmlnsXlink="http://www.w3.org/1999/xlink" 
                  x="0px" 
                  y="0px" 
                  viewBox="0 0 804 50.167" 
                  enableBackground="new 0 0 804 50.167" 
                  xmlSpace="preserve"
                >
                  <path fill="#333" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"></path>
                </svg>
                </div>
            </div>
            {isMobile && (
        <div className="mobile-controls">
          <button className="filter-btn" onClick={() => setIsModalOpen(true)}>Filters</button>
        </div>
      )}

      <FilterComponent2 filters={filters} onFilterChange={handleFilterChange} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="product">
                <div className="sidebar">
                <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
                </div>
                <div className="contents">
                <ProductComponent products={filteredProducts} addToCart={addToCart} />
                </div>
            </div>
            <SocialMediaBadges />
            <Footer />
        </div>
    );
};