import React from "react";
import "../Styles/Testimonials.css";
import testimony from "../List/testimony";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials(){
    return(
        <div className="Testimonials">
            <div className="heading">
                <h3>Customer Stories</h3>
            </div>
            <div className="review">
                {testimony.map((review , index)=> (
                    <TestimonialCard 
                        key={index}
                        name = {review.name}
                        message={review.message}
                    />
                ))}
            </div>
        </div>
    )
}