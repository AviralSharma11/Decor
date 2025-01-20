import React from "react";
import "../../Styles/HomePage/People.css"; 


const People = ({ imageSrc, title}) => {
    return (
      <div className="people">
        <div className="people-circle" data-title={title}>
          <img src={imageSrc} alt="Avatar" className="circle-image" />
        </div>
        {/* <div className="people-content">
          <h2>{title}</h2>
        </div> */}
      </div>
    );
  };
  
  export default People;