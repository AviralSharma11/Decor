import React from "react";
import { Link } from "react-router-dom";
import "./AdminSidebar.css"; // Optional: separate CSS if needed

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-links">
        <Link to="/"><div className="links">Dashboard</div></Link>
        <Link to="/admin-dashboard/users"><div className="links">Users</div></Link>
        <Link to="/admin-dashboard/orders"><div className="links">Orders</div></Link>
        <Link to="/admin-dashboard/products"><div className="links">Products</div></Link>
        <Link to="/admin-dashboard/settings"><div className="links">Settings</div></Link>
        <Link to="/logout"><div className="links">Logout</div></Link>
      </div>
    </aside>
  );
}
