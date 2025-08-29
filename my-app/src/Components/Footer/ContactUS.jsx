import React, {useState, useEffect} from "react";
import "../../Styles/Footer/FooterLinks.css";
import "../../Styles/Footer/ContactUS.css";
import Header from "../Header";
import Footer from "../Footer";
import LoginModal from "../LoginModal";
import Swal from "sweetalert2";
import SocialMediaBadges from "../SocialMediaBadges";

export default function ContactUS() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://72.60.97.97:5000/api/products");
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
      const response = await fetch("http://72.60.97.97:5000/api/contact", {
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
            const response = await fetch('http://72.60.97.97:5000/api/cart/remove', {
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
            const response = await fetch('http://72.60.97.97:5000/api/cart/update', {
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
    <><Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products}/>
    <div className="contact-container">
      <div className="contact-info">
        <h1>Contact Us</h1>
        <p>
          We would love to hear from you and we value your feedback. To let us
          know how we can improve your shopping experience, or to ask a specific
          question about your order. <strong>Find our contact information below.</strong>
        </p>

        <div className="info-item">
             <span className="icon">
                
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                    
                <strong>Whatsapp</strong>
            </span>
            <div>
            <a
             href="https://wa.me/qr/IMOVSX4SDTJ5M1 " // Replace with your WhatsApp link
            target="_blank"
            rel="noopener noreferrer"> 
               <p>+91 7509202484</p>
            </a>
          </div>
        </div>

        <div className="info-item">
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
            </svg>
          
      
            <strong>Email</strong>
            </span>
            <div>
            <p>support@oceanways.in</p>
          </div>
        </div>

        {/* <div className="info-item">
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
          
            <strong>Address</strong>
            </span>
          <div>
            <p>
              <strong>Registered Office Address:</strong> <br />
              azwesxrdctfyghuji,avsydh,asyvdghj,ubasdijfg.
            </p>
            <p>
              <strong>Corporate Office Address:</strong> <br />
              1. szdxfcvghjhgfcvghjnhbgvhjbnkmlnhbino. <br />
              2. vasdviafoaopotjropjpbjpjapotjopba.
            </p>
          </div>
        </div> */}
      </div>

      <div className="contact-form">
        <h2>WRITE TO US</h2>
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
      </div>  
    </div>
    <SocialMediaBadges />
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

