import React, {useState , useEffect} from "react";
import "../../Styles/Footer/FooterLinks.css";
import Footer from "../Footer";
import Header from "../Header";
import LoginModal from "../LoginModal";
import SocialMediaBadges from "../SocialMediaBadges";

export default function TermsConditions() {
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
                const [products, setProducts] = useState([]);
              
                useEffect(() => {
                  const storedEmail = localStorage.getItem("userEmail");
                  if (storedEmail) {
                    setUser({ email: storedEmail });
                  }
                }, []);

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
    <div className="terms-wrapper">
        <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />
      <div className="terms-section">
        <h1 className="terms-title">Terms of Use</h1>

        <h2 className="terms-heading">Overview</h2>
        <p>
          This website is operated by OceanWays Private Limited. Throughout the
          site, the terms "we", "us" and "our" refer to OceanWays Private
          Limited. OceanWays Private Limited offers this website, including all
          information, tools and services available from this site to you, the
          user, conditioned upon your acceptance of all terms, conditions,
          policies and notices stated here.
        </p>
        <p>
          By visiting our site and/or purchasing something from us, you engage
          in our Service and agree to be bound by the following terms and
          conditions ("Terms of Service", "Terms"), including those additional
          terms and conditions and policies referenced herein and/or available
          by hyperlink.
        </p>
        <p>
          Please read these Terms of Service carefully before accessing or using
          our website. By accessing or using any part of the site, you agree to
          be bound by these Terms. If you do not agree, then you may not access
          the website or use any services.
        </p>

        <h2 className="terms-heading">Section 1 - Online Store Terms</h2>
        <p>
          By agreeing to these Terms of Service, you represent that you are at
          least the age of majority in your state or province of residence. You
          may not use our products for any illegal or unauthorized purpose.
        </p>
        <p>
          You must not transmit any worms, viruses, or code of a destructive
          nature. A breach of any of the Terms will result in immediate
          termination of your Services.
        </p>

        <h2 className="terms-heading">Section 2 - General Conditions</h2>
        <p>
          We reserve the right to refuse service to anyone for any reason at any
          time. You agree not to reproduce, duplicate, copy or resell any part
          of the Service without express written permission.
        </p>
        <p>
          Your content (not including credit card information) may be
          transferred unencrypted and involve changes to conform to technical
          requirements. Credit card info is always encrypted.
        </p>

        <h2 className="terms-heading">
          Section 3 - Accuracy, Completeness, and Timeliness of Information
        </h2>
        <p>
          We are not responsible if information on this site is not accurate or
          current. Any reliance on the material is at your own risk. We may
          update content without obligation to notify users.
        </p>

        <h2 className="terms-heading">
          Section 4 - Modifications to the Service and Prices
        </h2>
        <p>
          Prices for our products are subject to change without notice. We
          reserve the right to modify or discontinue the Service without notice
          at any time.
        </p>

        <h2 className="terms-heading">Section 5 - Products or Services</h2>
        <p>
          Certain products may be available online only and have limited
          quantities. We try to display accurate product colors and images but
          cannot guarantee monitor accuracy.
        </p>
        <p>
          We reserve the right to limit sales by region or person, and to
          discontinue products. We do not guarantee that products or services
          will meet your expectations or that errors will be corrected.
        </p>
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
    </div>
  );
}
