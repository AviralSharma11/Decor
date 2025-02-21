import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import "@splidejs/splide/css";
import "../../Styles/Collection/Categories.css";

const Categories = () => {
  const categories = [
    { name: "TRENDING", image: "/Images/bytrend.jpg", link: "/collections/trending" },
    { name: "BY STYLE", image: "/Images/bystyles.jpg", link: "/collections/style" },
    { name: "BY MATERIAL", image: "/Images/bymaterial.jpg", link: "/collections/material" },
    { name: "BY THEMES", image: "/Images/bythemes.jpg", link: "/collections/themes" },
  ];

  return (
    <div className="carousel-container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/collections"><strong>Collections</strong></Link>
      </nav>

      {/* Upper wave */}
      <div className="slider-wave">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 804 50.167"
          preserveAspectRatio="none"
        >
         <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
              <stop offset="30%" stop-color="#4a4a4a" />
              <stop offset="100%" stop-color="#333" />
            </radialGradient>
          </defs>
          <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
        </svg>
      </div>

      {/* Splide Carousel */}
      <div className="sliders">
      <Splide
        className="screen"
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
            1024: { perPage: 3 },
            768: { perPage: 2 },
            480: { perPage: 1 },
          },
        }}
      >
        {categories.map((category, index) => (
          <SplideSlide key={index}>
            <Link to={category.link} className="slide">
              <img src={category.image} alt={`Slide ${index + 1}`} className="curved-image" />
              </Link>            
              <p className="category-name">{category.name}</p>
          
          </SplideSlide>
        ))}
      </Splide>

      {/* Lower wave */}
      <div className="slider-wave2">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 804 50.167"
          preserveAspectRatio="none"
        >
           <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" gradientTransform="rotate(90, 0.5, 0.5)">
              <stop offset="30%" stop-color="#4a4a4a" />
              <stop offset="100%" stop-color="#333" />
            </radialGradient>
          </defs>
          <path fill="url(#gradient)" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
        </svg>
      </div>
      </div>
    </div>
  );
};

export default Categories;
