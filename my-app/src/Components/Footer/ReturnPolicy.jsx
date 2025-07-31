import React , {useEffect , useState} from "react";
import "../../Styles/Footer/FooterLinks.css";
import Header from "../Header";
import Footer from "../Footer";
import LoginModal from "../LoginModal";
import SocialMediaBadges from "../SocialMediaBadges";

const ReturnPolicy = () => {
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
                      const response = await fetch("http://localhost:5000/api/products");
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
    <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products} />
    <div className="returns-policy-container">
      <h1>Returns & Refunds Policy</h1>
      <ol>
        <li>
          <strong>Damaged Products:</strong> If your product arrives damaged, please email us at care@oceanways.in within 24 hours with a photo of the damaged item and box. We will resolve it promptly.
        </li>
        <li>
          <strong>Return Eligibility:</strong> Return within 7 days of delivery (Not applicable on personalised products). Mention the item(s) clearly. Hand over only the return items.
          <ul>
            <li><strong>a)</strong> Free return shipping. Shipping charges are non-refundable.</li>
            <li><strong>b)</strong> Multiple returns from the same account may be denied or charged.</li>
          </ul>
        </li>
        <li><strong>Return Conditions:</strong> Unused items with original packaging and documents only.</li>
        <li><strong>Unserviceable Pin Codes:</strong> Pickup will be rescheduled when service resumes.</li>
        <li><strong>Missing Products / Tampering:</strong> Record video while unboxing. Contact support within 24 hours.</li>
        <li><strong>Shipping Delays:</strong> OceanWays is not liable for courier delays.</li>
        <li><strong>Order Cancellations:</strong> No cancellations after 4 hours. Packed orders are returnable only. Prepaid returns may incur two-way shipping fees.</li>
        <li><strong>Return Processing:</strong> Returns processed within 10 days. Contact care@oceanways.in or WhatsApp us +91 7509202484.</li>
        <li><strong>Approval Required:</strong> All returns must be pre-approved via email/WhatsApp.</li>
        <li><strong>Disputes:</strong> Jurisdiction: Courts of Indore, India.</li>
        <li><strong>Handcrafted Products:</strong> Slight variations in handmade goods are natural and not defects.</li>
        <li><strong>Bulk / Custom Orders:</strong> Return policy does not apply. Reviewed case by case.</li>
        <li><strong>Policy Abuse:</strong> Repeated returns may be denied.</li>
      </ol>
      <p>For questions or clarifications, reach out to care@oceanways.in – we’re happy to assist!</p>
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

export default ReturnPolicy;
