import React, { useState, useEffect } from "react";
import "../../Styles/HomePage/Testimonials.css";
import testimony from "../../List/testimony";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
    const [delays, setDelays] = useState([]);

    useEffect(() => {
        // Generate delays for each testimonial
        setDelays(testimony.map((_, index) => index * 300)); // 300ms interval
    }, []);

    return (
        <div className="Testimonials">
            <div className="heading">
                <h3>Customer Stories</h3>
            </div>
            <div className="review">
                {testimony.map((review, index) => (
                    <TestimonialCard 
                        key={index}
                        name={review.name}
                        message={review.message}
                        delay={delays[index] || 0} // Pass delay to each card
                    />
                ))}
            </div>
        </div>
    );
}
