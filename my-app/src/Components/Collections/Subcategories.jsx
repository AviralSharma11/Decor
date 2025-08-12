import React from "react";
import { useParams, Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "../../Styles/Collection/Categories.css"; // Reuse same styling

// Subcategory data
const subcategoriesData = {
  style: [
    { name: "Modern", image: "/Images/bystyles.jpg" },
    { name: "Vintage", image: "/Images/bytrend.jpg" },
    { name: "Earthy", image: "/Images/bymaterial.jpg" }
  ],
  material: [
    { name: "Wood", image: "/Images/bystyles.jpg" },
    { name: "Acrylic", image: "/Images/bytrend.jpg" },
    { name: "Glass", image: "/Images/bymaterial.jpg" },
    { name: "Resin", image: "/Images/bythemes.jpg" }
  ],
  theme: [
    { name: "Nature", image: "/Images/theme/nature.webp" },
    { name: "Minimal", image: "/Images/theme/minimal.webp" },
    { name: "Luxury", image: "/Images/theme/luxury.webp" }
  ]
};

// Map URL params to category keys
const categoryMap = {
  modern: "style",
  vintage: "style",
  earthy: "style",
  wood: "material",
  acrylic: "material",
  glass: "material",
  resin: "material",
  nature: "theme",
  minimal: "theme",
  luxury: "theme",
  style: "style",
  material: "material",
  theme: "theme",
};

export default function Subcategories() {
  const { categoryType, subcategory } = useParams();
  const mainCategoryKey =
    categoryMap[categoryType?.toLowerCase()] ||
    categoryMap[subcategory?.toLowerCase()] ||
    null;

  const subcategories = mainCategoryKey
    ? subcategoriesData[mainCategoryKey] || []
    : [];

  return (
    <div className="carousel-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections">Collections</Link> &gt;
        <strong>{mainCategoryKey?.toUpperCase()}</strong>
      </nav>

      {/* Upper wave */}
      <div className="slider-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 804 50.167" preserveAspectRatio="none">
          <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
              <stop offset="30%" stopColor="#4a4a4a" />
              <stop offset="100%" stopColor="#333" />
            </radialGradient>
          </defs>
          <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
        </svg>
      </div>

      {/* Carousel */}
      <div className="sliders">
        {subcategories.length > 0 ? (
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
            {subcategories.map((sub, index) => (
              <SplideSlide key={index}>
                <Link
                  to={`/collections/${mainCategoryKey}/${sub.name.toLowerCase()}`}
                  className="slide"
                >
                  <img src={sub.image} alt={sub.name} className="curved-image" />
                </Link>
                <p className="category-name">{sub.name}</p>
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <p>No subcategories found.</p>
        )}

        {/* Lower wave */}
        <div className="slider-wave2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 804 50.167" preserveAspectRatio="none">
            <defs>
              <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
                <stop offset="30%" stopColor="#4a4a4a" />
                <stop offset="100%" stopColor="#333" />
              </radialGradient>
            </defs>
            <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
