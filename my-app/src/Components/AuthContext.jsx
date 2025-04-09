import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");
    setUserEmail(storedEmail);
    setIsAuthenticated(!!token);
  }, []);

  const login = (email, token) => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("token", token);
    localStorage.setItem("isAuthenticated", "true");
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userEmail, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
