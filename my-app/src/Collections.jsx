import React , {useState} from "react";
import Header from "./Components/Header";
import SocialMediaBadges from "./Components/SocialMediaBadges";
import Footer from "./Components/Footer";
import Categories from "./Components/Collections/Categories";
import FilterComponent from "./Components/FilterComponent";
import ProductComponent from "./Components/ProductComponent";
import {  filters as initialFilters, products as initialProducts } from "./List/product";
import "./Collections.css";

export default function Collections(){
    const [filters] = useState(initialFilters);
    const [products] = useState(initialProducts);
    const [selectedFilters, setSelectedFilters] = useState({
        Type: [],
        Color: [],
        Price: [],
    });

    const handleFilterChange = (filterCategory, value, isChecked) => {
        setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (isChecked) {
            // Add the value to the filter category
            updatedFilters[filterCategory] = [...updatedFilters[filterCategory], value];
        } else {
            // Remove the value from the filter category
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
            !selectedFilters.Type.includes(product.name.split(' ')[0]) // Example logic
        ) {
            return false;
        }

        // Filter by Color (assuming products have a "color" field)
        if (selectedFilters.Color.length > 0 && !selectedFilters.Color.includes(product.color)) {
            return false;
        }

        // Filter by Price
        if (selectedFilters.Price.length > 0) {
            const priceRange = selectedFilters.Price.find((range) => {
            if (range === 'Under ₹1,000') return product.price < 1000;
            if (range === '₹1,000 - ₹3,000') return product.price >= 1000 && product.price <= 3000;
            if (range === 'Above ₹3,000') return product.price > 3000;
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
    return(
        <div className="Collections">
            <Header/>
            <Categories />
            <div className="product">
                <div className="sidebar">
                    <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
                </div>
                <div className="contents">
                    <ProductComponent products={products} />
                </div>
            </div>
            <SocialMediaBadges />
            <Footer />
        </div>
    )
}