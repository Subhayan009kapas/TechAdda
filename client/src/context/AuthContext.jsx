import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, token) => {
  setUser(userData);
  setToken(token); // ✅ token should be a plain string
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", token); // ✅ store raw string, not object
};


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
