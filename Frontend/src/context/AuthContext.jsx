import { createContext, useContext, useEffect, useState } from "react";
import isTokenExpired from "../Pages/isTokenExpired";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      showLogin,
      setShowLogin,
      showSignup,
      setShowSignup,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
