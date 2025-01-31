import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Collection/Categories.css";

const Categories = () => {
  const categories = [
    { name: "TRENDING", image: "/Images/bytrend.jpg", link: "/collections/trending"},
    { name: "BY STYLE", image: "/Images/bystyles.jpg", link: "/collections/style"},
    { name: "BY MATERIAL", image: "/Images/bymaterial.jpg", link: "/collections/material" },
    { name: "BY THEMES", image: "/Images/bythemes.jpg" , link: "/collections/themes" },
  ];

  return (
    <div className="categories-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections"> Collections</Link>
      </nav>

      {/* Categories Section */}
      <div className="categories">
        {categories.map((category, index) => (
          <Link key={index} to={category.link} className="category-card">
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
  );
};

export default Categories;
