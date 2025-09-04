import React, { useEffect, useState } from "react";
import "../../Styles/AdminDashboard/Orders.css";
import { API_BASE_URL } from "../../api/config";


export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const downloadExcel = () => {
    window.open(`${API_BASE_URL}/orders/export`, "_blank");
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
            <th>Total</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_email}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.total}</td>
              <td>{order.order_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
