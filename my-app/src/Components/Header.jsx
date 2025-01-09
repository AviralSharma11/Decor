import React ,{ useEffect, useState } from "react";
import "../Styles/Header.css";

const Header = () => {
    const [isHidden, setIsHidden] = useState(false);
    let lastScrollY = 0;

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setIsHidden(true); // Scrolling down
        } else {
            setIsHidden(false); // Scrolling up
        }
        lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);
  return (
    <header className={`header ${isHidden ? "hidden" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <h1>TITLE</h1>
          <span className="subtitle">Sub Title</span>
        </div>
        <nav className="nav">
          <ul className="nav-links">
            <li>Customised</li>
            <li>Wood</li>
            <li>Acrylic</li>
            <li>Aviral</li>
            <li>Sharma</li>
          </ul>
        </nav>
        <div className="icons">
          <span className="icon">🔍</span>
          <span className="icon">👤</span>
          <span className="icon">👜</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
