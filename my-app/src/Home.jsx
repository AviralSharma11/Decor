import React, {useState , useEffect} from 'react';
import Header from './Components/Header';
import Showcase from './Components/HomePage/Showcase';
import GiftingGuide from './Components/HomePage/GiftingGuide';
import BestSeller from './Components/HomePage/BestSeller';
import SocialMediaBadges from './Components/SocialMediaBadges';
import Footer from './Components/Footer';
import "./Home.css";
import ReviewBoard from './Components/HomePage/Reviewboard';

function Home() {
  const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    });
  
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
  
    const addToCart = (product) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        let updatedCart;
    
        if (existingItem) {
          updatedCart = prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updatedCart = [...prevCart, { ...product, quantity: 1 }];
        }
    
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
        return updatedCart;
      });
    };

    const removeFromCart = (productId) => {
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
        return updatedCart;
      });
    };

    const updateQuantity = (productId, newQuantity) => {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart
        return updatedCart;
      });
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
        <ReviewBoard />
        <SocialMediaBadges />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
