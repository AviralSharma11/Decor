import React , {useState , useEffect} from "react";
import "../../../Styles/Footer/blogs.css";
import Footer from "../../Footer";
import SocialMediaBadges from "../../SocialMediaBadges";
import Header from "../../Header";
import { products } from "../../../List/product";
import LoginModal from "../../LoginModal";

const Blogs = () => {
      
        const [cart, setCart] = useState(() => {
          const savedCart = localStorage.getItem("cart");
          return savedCart ? JSON.parse(savedCart) : [];
        });
        const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
        const [isAuthenticated, setIsAuthenticated] = useState(() => {
          return localStorage.getItem("isAuthenticated") === "true"; // Check login status
        });
    
          const [user, setUser] = useState(() => {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
          });
          
            useEffect(() => {
              const storedEmail = localStorage.getItem("userEmail");
              if (storedEmail) {
                setUser({ email: storedEmail });
              }
            }, []);
    
            const removeFromCart = async (productId) => {
              if (!isAuthenticated) return;
            
              try {
                const response = await fetch('http://localhost:5000/api/cart/remove', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: localStorage.getItem('userEmail'), // Assuming email is stored in localStorage
                    productId,
                  }),
                });
            
                const data = await response.json();
            
                if (response.ok) {
                  setCart((prevCart) => {
                    const updatedCart = prevCart.filter((item) => item.id !== productId);
                    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
                    return updatedCart;
                  });
                  console.log(data.message);
                } else {
                  console.error('Failed to remove from cart:', data.message);
                }
              } catch (error) {
                console.error('Error:', error);
              }
            };
            
          
            const updateQuantity = async (productId, newQuantity) => {
              if (newQuantity < 1) return; // Prevent setting quantity to less than 1
            
              try {
                const response = await fetch('http://localhost:5000/api/cart/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                    productId,
                    quantity: newQuantity,
                  }),
                });
            
                if (!response.ok) {
                  throw new Error(`Failed to update quantity: ${response.statusText}`);
                }
            
                const data = await response.json();
                console.log(data.message);
            
                // Update cart state if successful
                setCart((prevCart) => 
                  prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                  )
                );
              } catch (error) {
                console.error("Error updating quantity:", error);
              }
            };

  return (
    <>
    <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products}/>
    <div className="blog-coming-soon">
      <div className="blog-content">
        <h1>Our Blog is Coming Soon</h1>
        <p>We’re working on something amazing. Stay tuned!</p>
        <img
          src="/Images/ComingSoon.png"
          alt="Coming Soon"
          className="coming-soon-img"
        />
      </div>
      <SocialMediaBadges />
    </div>
    {isLoginModalOpen && (
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={() => {
                  setIsAuthenticated(true);
                  localStorage.setItem("isAuthenticated", "true");
                  setIsLoginModalOpen(false); // Close modal after login
                  window.location.reload();
                }}
              />
            )}
    <Footer />
    </>
  );
};

export default Blogs;
