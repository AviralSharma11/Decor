import React, { useEffect, useState } from "react";
import "../Styles/Header.css";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Header = ({ cart }) => { // Use the cart prop
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen , setIsLoginOpen] = useState(false);

  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    document.body.style.overflowY = newMenuState ? "hidden" : "auto";
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    document.body.style.overflowY = !isCartOpen ? "hidden" : "auto";
  };

  const goToLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    document.body.style.overflowY = !isLoginOpen ? "hidden" : "auto";
  }

  // Calculate total price of the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.originalPrice * item.quantity, 0);
  return (
    <>
      <header className={`header ${isHidden ? "hidden" : ""}`}>
        <div className="header-container">
          <div className="hamburger" onClick={toggleMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
          <div className="logo">
            <h1>TITLE</h1>
            <span className="subtitle">Sub Title</span>
          </div>
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            <div className="hamburgerContent">
              <ul className="nav-links content">
                <li>Customised</li>
                <li>Wood</li>
                <li>Acrylic</li>
                <li>Aviral</li>
                <li>Sharma</li>
              </ul>
              <div className="profileViewer show" onClick={goToLogin}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="33"
                  fill="currentColor"
                  className="bi bi-person content"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
                <span>Log In</span>
              </div>
            </div>

            
          </nav>

          <div className="icons-grid">
            <div className="icons search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
            <div className="icons profile hidden " onClick={goToLogin}>
              <svg xmlns="http://www.w3.org/2000/svg"  height= "33" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </div>
            <div className="icons cart" onClick={toggleCart}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-bag-check"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"
                />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {isLoginOpen &&(
        <div className="login-menu">
          <Login />
        </div>
      )}

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <button className="close-cart" onClick={toggleCart}>
              ×
            </button>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <ul>
                  {cart.map((item, index) => (
                    <li key={index}>
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                      <span>₹{item.originalPrice}</span>
                      <span>Quantity: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <h3>Total: ₹{calculateTotal()}</h3>
              </>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default Header;
