import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Appointment from "./pages/Appointment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Context } from "./main";
import Footer from "./components/footer";
import Loading from "./components/Loading";
import MedicalHistory from "./components/MedicalHistory";



const App = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userRole,
    setUserRole,
  } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      setUserRole(storedRole || parsedUser.role || "");
    } else {
      setIsAuthenticated(false);
      setUser({});
      setUserRole("");
    }

    setLoading(false);
  }, [setIsAuthenticated, setUser, setUserRole]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />

          <Route
            path="/register"
            element={
              <Register
                onRegister={(userData) => {
                  localStorage.setItem("user", JSON.stringify(userData));
                  localStorage.setItem("userRole", userData.role || "");
                  localStorage.setItem("isAuthenticated", "true");
                  setUser(userData);
                  setUserRole(userData.role || "");
                  setIsAuthenticated(true);
                }}
              />
            }
          />

          <Route
            path="/login"
            element={
              <Login
                onLogin={(userData) => {
                  localStorage.setItem("user", JSON.stringify(userData));
                  localStorage.setItem("userRole", userData.role || "");
                  localStorage.setItem("isAuthenticated", "true");
                  setUser(userData);
                  setUserRole(userData.role || "");
                  setIsAuthenticated(true);
                }}
              />
            }
          />

          <Route
            path="/medical-history"
            element={
              isAuthenticated ? (
                <MedicalHistory userEmail={user?.email} userRole={userRole} />
              ) : (
                <Login />
              )
            }
          />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
