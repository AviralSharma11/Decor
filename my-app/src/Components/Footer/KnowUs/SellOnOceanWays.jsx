import React , {useState , useEffect} from 'react';
import '../../../Styles/Footer/SellOnOceanWays.css';
import Header from '../../Header';
import Footer from '../../Footer';
import SocialMediaBadges from '../../SocialMediaBadges';
import LoginModal from '../../LoginModal';
import { products } from '../../../List/product';
import Swal from 'sweetalert2';

const SellOnOceanWays = () => {
      const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contact: "",
        subject: "",
        message: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch("http://localhost:5000/api/join-us", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Message Sent!",
              text: "We will get back to you soon.",
              confirmButtonColor: "#3085d6",
            });
      
            setFormData({
              fullName: "",
              email: "",
              contact: "",
              subject: "",
              message: "",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: data.error || "Failed to send message.",
              confirmButtonColor: "#d33",
            });
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "There was an issue submitting your message. Please try again later.",
            confirmButtonColor: "#d33",
          });
        }
      };

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
    <div className="sell-container">
      <h1>Who can Apply?</h1>
      <p className="subheading">
        Interior Designers and Entrepreneurs who frequently sell home decor, furniture, or curated lifestyle products can apply to collaborate with OceanWays.
      </p>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <h3>1</h3>
            <h4>Register</h4>
            <ul>
              <li>Full name and contact number</li>
              <li>Company details & social media links</li>
              <li>Website link (if any)</li>
              <li>GST number</li>
              <li>Bank details for commission transfer</li>
            </ul>
          </div>
          <div className="step">
            <h3>2</h3>
            <h4>Get Approved</h4>
            <p>We will verify your details and get back to you with next steps.</p>
          </div>
          <div className="step">
            <h3>3</h3>
            <h4>Start Selling</h4>
            <p>List your products and reach thousands of customers through OceanWays.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Sell on OceanWays</h2>
        <p>
          We’re here to help you grow your business with exclusive benefits, insights, and personalized support from our team.
          Join our Sell on OceanWays initiative and enjoy exclusive perks.
        </p>
        <div className="perks">
          <div>
            <img src="/Images/discount.png" alt="Exclusive Offers" />
            <p>Exclusive Offers</p>
          </div>
          <div>
            <img src="/Images/peoplegrp.png" alt="Reach New Customers" />
            <p>Reach New Customers</p>
          </div>
          <div>
            <img src="/Images/tracksale.png" alt="Track Sales" />
            <p>Track Sales Monthly</p>
          </div>
          <div>
            <img src="/Images/early.png" alt="Early Access" />
            <p>Early Access to Tools</p>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>Join Us</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="send-btn">SEND</button>
        </form>
      </section>
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

export default SellOnOceanWays;
