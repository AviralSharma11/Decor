import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/HomePage/GiftingGuide.css";
import People from "./People";
import peopleData from "../../List/peopledata";

export default function GiftingGuide(){
    return (
        <div className="GiftingGuide">
            <div className="heading">
                <h3>Gifting Guide</h3>
            </div>
          <div className="People">
            {peopleData.map((person, index) => (
              <Link key={index} to={person.url} className="people-card-link">
                <People imageSrc={person.imageSrc} title={person.title} />
              </Link>
            ))}
          </div>
        </div>
      );
}