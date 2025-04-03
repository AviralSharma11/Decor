import React from "react";
import "../../Styles/HomePage/Showcase.css";

const Showcase = () => {
  return (
    <section className="showcase">
      <div className="image-grid">
        <div className="image-item  ">
          <img src="/Images/LoveTokens1.jpg" alt="img 1" />
          <span className="hiddentext">Reflection</span>
        </div>
        <div className="image-item">
          <img src="/Images/LampCover.jpg" alt="img 3" className="middle"/>
          <span className="hiddentext">Mesmerisation</span>
        </div>
        <div className="image-item">
          <img src="/Images/Bestseller2.avif" alt="img 2" className="middle" />
          <span className="hiddentext">Drop Of Soul</span>
        </div>
        <div className="image-item hidden">
          <img src="/Images/par.webp" alt="img 4" className="last" />
        </div>
      </div>
      <div className="text-section hidden">
        <h2>PERSONALIZED ART, PERFECTED SPACES</h2>
        <p>Bringing your vision to life, one masterpiece at a time</p>
      </div>
    </section>
  );
};

export default Showcase;
