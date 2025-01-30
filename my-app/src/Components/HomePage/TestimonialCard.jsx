import React, { useState, useEffect, useRef } from "react";
import "../../Styles/HomePage/TestimonialCard.css";

const TestimonialCard = ({ name, message, delay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsOpen(true), delay); // Apply delay
        } else {
          setIsOpen(false);
        }
      },
      { threshold: 0.8 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]); // Ensure delay is used in the effect

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
