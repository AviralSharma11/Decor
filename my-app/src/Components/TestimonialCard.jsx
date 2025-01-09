import React from "react";
import "../Styles/TestimonialCard.css"; 

const TestimonialCard = ({ name, message}) => {
  return (
    <div className="testimonial-card">
      <h3 className="testimonial-name">{name}</h3>
      <p className="testimonial-message">{message}</p>
    </div>
  );
};

export default TestimonialCard;
