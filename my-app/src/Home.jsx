import React, {useState} from 'react';
import Header from './Components/Header';
import Showcase from './Components/HomePage/Showcase';
import GiftingGuide from './Components/HomePage/GiftingGuide';
import BestSeller from './Components/HomePage/BestSeller';
import Collage from './Components/HomePage/Collage';
import Testimonials from './Components/HomePage/Testimonials';
import SocialMediaBadges from './Components/SocialMediaBadges';
import Footer from './Components/Footer';
import "./Home.css";

function Home() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
  return (
    <div className="Home">
      <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} />
        <Showcase />
        <div className="parallax1"></div> {/* Parallax background section */}
        <div className="content-section">
        <GiftingGuide />
      </div>
      <div className="parallax2"></div> {/* Add another parallax section if needed */}
      <div className="content-section">
        <BestSeller addToCart={addToCart}/>
      </div>
      <div className="parallax3"></div> {/* Add another parallax section if needed */}
      <div className="content-section">
        <Collage />
        <SocialMediaBadges />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
