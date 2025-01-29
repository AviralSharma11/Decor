import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Collection/Categories.css";

const Categories = () => {
  const categories = [
    { name: "TRENDING", image: "/Images/bytrend.jpg" },
    { name: "BY STYLE", image: "/Images/bystyles.jpg" },
    { name: "BY MATERIAL", image: "/Images/bymaterial.jpg" },
    { name: "BY THEMES", image: "/Images/bythemes.jpg" },
  ];

  return (
    <div className="categories-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections"> Collections</Link> &gt;
        <Link to="/shop-all-collections"> Shop All Collections</Link>
      </nav>

      {/* Categories Section */}
      <div className="categories">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />
            <p className="category-label">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
