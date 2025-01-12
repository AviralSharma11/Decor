import React from "react";
import "../Styles/Collage.css";
import colpics from "../List/colpics";
import Gallery from "react-photo-gallery";

export default function Collage() {
  return (
    <div className="Collage">
      <div className="heading">
        <h3>Customer Love</h3>
      </div>
      <div className="pictures">
        <Gallery photos={colpics} />
      </div>
    </div>
  );
}
