import React, { useState, useEffect, useRef } from "react";
import "../../Styles/HomePage/TestimonialCard.css";

const TestimonialCard = ({ name, message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOpen(entry.isIntersecting); 
      },
      { threshold: 0.5 } // 50% card
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div className="testimonial-card" ref={cardRef}>
      <div className="container">
        <div className={`envelope-wrapper ${isOpen ? "flap" : ""}`}>
          <div className="envelope">
            <div className="letter">
              <div className="text">
                <strong>{name}</strong>
                <p>{message}</p>
              </div>
            </div>
          </div>
          <div className="heart"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
