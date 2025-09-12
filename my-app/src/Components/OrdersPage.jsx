import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";
import Header from "./Header";
import Footer from "./Footer";
import SocialMediaBadges from "./SocialMediaBadges";
import LoginModal from "./LoginModal";
import "../Styles/OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const cart = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUser({ email: storedEmail });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${user.email}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  // 🔹 Helper to render state messages
  const renderMessage = (title, subtitle, icon) => (
    <div className="orders-message">
      <div className="orders-message-card">
        <div className="orders-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );

  

  return (
    <div className="orders-page">
      <Header cart={cart} user={user} />

      <main className="orders-content">
        {loading
          ? renderMessage("Loading Orders...", "Please wait while we fetch your order history.", "⏳")
          : !user
          ? renderMessage("Login Required", "Please login to view your orders.", "🔑")
          : orders.length === 0
          ? renderMessage("No Orders Yet", "You haven’t placed any orders yet. Start shopping now!", "🛒")
          : (
            <div className="orders-list">
              <h2 className="orders-title">My Orders</h2>
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <span className={`status ${order.payment_status?.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Amount:</strong> ₹{order.amount}</p>
                  <p><strong>Payment ID:</strong> {order.payment_id || "N/A"}</p>

                  <div className="order-products">
                    <h4>Products:</h4>
                    {order.products?.length > 0 ? (
                      <ul>
                        {order.products.map((p, idx) => (
                            
                          <li key={idx} className="order-product">
                            <img
                            src={p.image[0] || "/placeholder.png"}
                            alt={p.product_name}
                            className="order-product-image"
                            />
                            <div>
                              <p className="product-name">{p.product_name}</p>
                              <p className="product-price">
                                ₹{p.price} × {p.quantity}
                              </p>
                              {p.custom_text && (
                                <p className="custom-text">
                                  Custom: {JSON.stringify(p.custom_text)}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No products listed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </main>

      <SocialMediaBadges />
      <Footer />

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={() => {
            localStorage.setItem("isAuthenticated", "true");
            setIsLoginModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
