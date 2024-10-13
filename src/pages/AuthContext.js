// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

// Set Axios base URL and enable credentials
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    navigate(`/teacher-profile/${userData.id}`, {replace: true}); // Redirect to profile
  };
  
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    // navigate(`/`, {replace: true}); // Redirect to home
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Load from sessionStorage if exists
    } else {
      axios.get('/api/check-auth')  // Fallback to API if no session storage
        .then(response => {
          if (response.data.loggedIn) {
            setUser(response.data.user);
          }
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
