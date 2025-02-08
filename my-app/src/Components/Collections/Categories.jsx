import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
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
        {categories.map((category, index) => (
          <SplideSlide key={index}>
            <img src={category.image} alt={`Slide ${index + 1}`} className="curved-image" />
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
  );
};

export default Categories;
