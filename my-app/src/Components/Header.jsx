import React, { useEffect, useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../Styles/Header.css";
import LoginModal from "./LoginModal";

const Header = ({ cart , onRemoveFromCart , updateQuantity}) => { // Use the cart prop
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const lastScrollY = useRef(0); //  Use useRef instead of a regular variable

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = window.scrollY; //  Update the ref value
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  

  // Calculate total price of the cart
  const calculateDiscountedTotal = () =>
    cart.reduce((total , item) => total + item.discountedPrice*item.quantity , 0 );

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.originalPrice * item.quantity, 0);

  const formatPrice = (price) => price.toLocaleString("en-IN");

  const navigate = useNavigate();

  const proceedToCheckout = () =>{
    navigate( "/checkout");
  };

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
            <Link to="/" style={{textDecoration: 'none'}}>
            <h1 className="company-name">TITLE</h1>
            <span className="subtitle">Sub Title</span>
            </Link>
          </div>
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            <div className="hamburgerContent">
              <ul className="nav-links content">
                <li><Link to="/collections/customised-products">Customisable</Link></li>
                <li><Link to="/material/wood">Wood</Link></li>
                <li><Link to="/material/acrylic">Acrylic</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link>Sharma</Link></li>
              </ul>
              <div className="profileViewer show"onClick={openModal}>
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
              <LoginModal isOpen={isModalOpen} onClose={closeModal} />
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
            <div className="icons profile hidden " onClick={openModal}>
              <svg xmlns="http://www.w3.org/2000/svg"  height= "33" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </div>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
            <div className="icons cart" onClick={toggleCart}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
            </svg>
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}

            </div>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
              <div className="cart-top">
                <h2>Shopping Cart</h2>
                <button className="close-cart" onClick={toggleCart}>
                  ×
                </button>
              </div>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
              <ul>
                {cart.map((product, index) => (
                  <li key={index}>
                    <Link 
                      to={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`} 
                      state={{ product }} 
                      style={{ textDecoration: "none" }}>
                      <img src={product.image} alt={product.name} className="item-image" />
                    </Link>

                    <div className="items">
                      <Link 
                        to={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`} 
                        state={{ product }} 
                        style={{ textDecoration: "none" }}>
                        <span className="item-name">{product.name}</span>
                      </Link>

                      <span className="item-price">₹{product.discountedPrice}</span>
                      <span className="item-price original">₹{product.originalPrice}</span>

                      <div className="quantity-controls">
                        <button 
                          className="quantity-button" 
                          onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          disabled={product.quantity === 1}>
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button 
                          className="quantity-button" 
                          onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                          +
                        </button>
                      </div>

                      <button className="remove-item" onClick={() => onRemoveFromCart(product.id)}>X</button>
                    </div>
                  </li>
                ))}
              </ul>

                <div className="price-details">
                  <h4 >Price Details: </h4>
                    <div className="price">Total MRP: 
                      <div className="total-mrp">₹ {formatPrice(calculateTotal())}</div>
                    </div>
                    <div className="price">Money Saved:
                      <div className="money-saved">-₹ {formatPrice(calculateTotal()-calculateDiscountedTotal())}</div>
                    </div>
                    <div className="price" style={{fontWeight: 600}}>Total Amount:
                      <div className="total-amount"> ₹ {formatPrice(calculateDiscountedTotal())}</div>
                    </div>
                </div>
                <div className="cart-footer">
                  <button className="checkout" onClick={proceedToCheckout}> <div className="dot"></div>Proceed To Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


    </>
  );
};

export default Header;
