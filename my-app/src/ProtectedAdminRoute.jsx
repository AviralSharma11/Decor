// components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "oceanwaez@gmail.com"; // set your admin email

export default function ProtectedAdminRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail !== ADMIN_EMAIL) {
    return <Navigate to="/" />; 
  }

  return children;
}
