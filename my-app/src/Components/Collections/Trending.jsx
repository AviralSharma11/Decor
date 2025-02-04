import React, {useState} from "react";
import { Link } from "react-router-dom";
import "../../Styles/Collection/Categories.css";
import Header from "../Header";
import Footer from "../Footer";
import SocialMediaBadges from "../SocialMediaBadges";
import ProductComponent from "../ProductComponent";
import FilterComponent from "../FilterComponent";
import { filters as initialFilters, products as initialProducts  } from "../../List/product";
import "../../Collections.css";

export default function Trending(){
    const [filters] = useState(initialFilters);
    const [products] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        Type: [],
        Color: [],
        Price: [],
    });

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
        { name: "DOPAMINE", image: "/Images/bytrend.jpg", link: "/trending/dopamine"},
        { name: "COQUETTE", image: "/Images/bystyles.jpg", link: "/trending/coquette"},
        { name: "SOFT GIRL AESTHETIC", image: "/Images/bymaterial.jpg", link: "/trending/soft-girl-aesthetic" }
      ];
    return(
        <div className="material">
            <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <div className="categories-container">
                {/* Breadcrumb Navigation */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> &gt;
                    <Link to="/collections"> Collections</Link> &gt;
                    <Link to="/collections/trending"> Shop By Trending</Link>
                </nav>
            
                {/* Categories Section */}
                <div className="categories">
                    {material.map((category, index) => (
                    <Link key={index} to={category.link} className="category-card" style={{textDecoration: "none"}}>
                        <img
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                        />
                        <p className="category-label">{category.name}</p>
                    </Link>
                    ))}
                </div>
            </div>
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