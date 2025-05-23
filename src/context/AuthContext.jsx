import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.username) {
        setUser(data.username);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (username) => setUser(username);

  const logout = () => {
    fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
