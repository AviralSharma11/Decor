import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/HomePage/TopFeedbacks.css";

export default function TopFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("/api/feedback/top")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="feedback-container">
      <h2 className="feedback-heading">Reviews</h2>
      <p className="feedback-subtitle">@oceanways.in</p>
      <div className="feedback-cards">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <h3 className="feedback-name">{fb.name}</h3>
            <p className="feedback-text">{fb.message}</p>
            <div className="feedback-stars">
              {"★".repeat(fb.rating) + "☆".repeat(5 - fb.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
