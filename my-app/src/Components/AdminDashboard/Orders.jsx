import React, { useEffect, useState } from "react";
import "../../Styles/AdminDashboard/Orders.css";
import { API_BASE_URL } from "../../api/config";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        const parsedData = data.map((order) => ({
          ...order,
          products:
            typeof order.products === "string"
              ? JSON.parse(order.products)
              : order.products,
        }));
        setOrders(parsedData);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const downloadExcel = () => {
    window.open(`${API_BASE_URL}/orders/export`, "_blank");
  };

  const deleteOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setOrders((prev) => prev.filter((order) => order.id !== id));
      })
      .catch((err) => console.error("Error deleting order:", err));
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <button className="export-btn" onClick={downloadExcel}>
        Export to Excel
      </button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Email</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total (Line)</th>
            <th>Order Total</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) =>
            order.products && order.products.length > 0 ? (
              order.products.map((p, idx) => (
                <tr key={`${order.id}-${idx}`}>
                  <td>{order.id}</td>
                  <td>{order.user_email}</td>
                  <td>{p.product_name}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price * p.quantity}</td>
                  <td>₹{order.amount}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>{order.payment_status}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_email}</td>
                <td colSpan="3">No products</td>
                <td>₹{order.amount}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.payment_status}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
