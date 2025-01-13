import React from "react";
import "../Styles/Showcase.css";

const Showcase = () => {
  return (
    <section className="showcase">
      <div className="image-grid">
        <div className="image-item  ">
          <img src="/Images/download.jpeg" alt="img 1" />
          <span className="hiddentext">Rafael Nadal : Spanish Bull</span>
        </div>
        <div className="image-item">
          <img src="/Images/download1.jpeg" alt="img 2" />
          <span className="hiddentext">Kevin De Bryune Let him talk</span>
        </div>
        <div className="image-item">
          <img src="/Images/download1.jpeg" alt="img 3" />
          <span className="hiddentext">KDB : Ginger Mastero</span>
        </div>
        <div className="image-item hidden">
          <img src="/Images/download.jpeg" alt="img 4" />
        </div>
      </div>
      <div className="text-section hidden">
        <h2>FOR PIECES THAT SPARKLE LIKE YOU DO</h2>
        <p>CRAFTED IN PURE SILVER</p>
      </div>
    </section>
  );
};

export default Showcase;
