import React from "react";
import { Outlet } from "react-router-dom";
import "./AdminDashboard.css"; 
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
