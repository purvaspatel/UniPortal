// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate(`/teacher-profile/${userData.id}`); // Save to localStorage
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate(`/`); // Clear from localStorage
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Load from localStorage if exists
    } else {
      axios.get('/api/check-auth')  // Fallback to API if no local storage
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
