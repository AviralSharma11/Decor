import React, { useState, useEffect } from "react";
import "../../Styles/Footer/FooterLinks.css";
import Header from "../Header";
import Footer from "../Footer";
import "../../Styles/Footer/Shipping.css";
import SocialMediaBadges from "../SocialMediaBadges";

export default function Shipping(){
    const shippingInfo = [
        // { name: "Create a Return", path: "/create-return" },
        { details: "We give the estimated time of delivery on the shipping page. However, these are indicative and depend on our shipping partner." },
        { details: "The delivery times are subject to location, distance and our logistics partners. We are not liable for any delays in delivery by the courier company/postal authorities but will help you track down a package through our partner courier services." },
        { details: "Your purchases may reach you from various locations in more than one package. But rest assured, you will be charged one delivery fee for the entire order." },
        { details: "As soon as your package ships, we will email you your package tracking information."},
        { details: "Cash On Delivery option is not a trial option and payment is necessary before accepting the order. Any refusal of COD orders will result in deactivation of the COD option for future orders." },
        { details: "In some pin codes, our shipping partners do not support COD and hence the option might be unavailable. For any queries, please contact our customer WhatsApp helpline." },
        { details: "In case of any special time bound delivery requirements, please share an email with us and leave comments in the order about the requested time of delivery. We will try our best to fulfill the order within the time requested but we cannot guarantee the same."},
        { details: "Orders placed in India are catered by safe and reliable courier companies like Delhivery, Ecom Express and Amazon Shipping."},
        { details: "We are bound in coverage by their reach even though we use some of India's largest logistics companies for shipping. In case your address is in a location not served by them we would contact you to find an alternative solution to make your products reach you."},
        { details: "For any cancellations, we require an email within 4 hours of the order being placed. If the order is shipped out, cancellations will not be accepted. We will be unable to process any refund if an order is cancelled at the doorstep or if there have been 3 failed attempts to deliver the parcel by our delivery partner."},
        { details: "Look out for international shipping coming soon at Nestasia. Nestasia currently does not ship to any PO Boxes or APO addresses."},
      ];
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
      });

        const [products, setProducts] = useState([]);
    
      useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);
    

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

    return(
        <div className="shipping-container">
         <Header cart={cart} onRemoveFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} products={products}/>
         <div className="shipping">
            <h3 className="page-title">Shipping</h3>
            <p className="notice">We ship across all over India</p>
            <div className="shipping-table"></div>
            <div className="shipping-info">
                <ul className="info-list">
                {shippingInfo.map((item) => (
                <li key={item.details}>{item.details}</li>
                ))}
                </ul>
            </div>
            <p>In case of any queries and doubts, we are happy if you write to us at <span style={{fontWeight:600}}>support@oceanways.in</span></p>
         </div>
         <SocialMediaBadges />
         <Footer />   
        </div>
    );
}