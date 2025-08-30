import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user information
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  // Fetch the user's profile on app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/mongo/auth/profile");
        setUser(response.data.user); // Restore user state
      } catch (err) {
        console.error("Not authenticated:", err);
        setUser(null); // Clear user state if not authenticated
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfile();
  }, []);

  const login = (userData) => {
    setUser(userData); // Save user info in the context
    navigate("/dashboard"); // Redirect to notes page after login
  };

  const logout = async () => {
    try {
      await api.post("/mongo/auth/logout");
      setUser(null);
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>; // Show loading indicator while restoring session
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
