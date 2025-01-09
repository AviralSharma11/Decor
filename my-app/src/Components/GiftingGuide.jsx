import React from "react";
import "../Styles/GiftingGuide.css";
import People from "./People";
import peopleData from "../List/peopledata";

export default function GiftingGuide(){
    return (
        <div className="GiftingGuide">
            <div className="heading">
                <h3>Gifting Guide</h3>
            </div>
          <div className="People">
            {peopleData.map((person, index) => (
              <People
                key={index}
                imageSrc={person.imageSrc}
                title={person.title}
              />
            ))}
          </div>
        </div>
      );
}