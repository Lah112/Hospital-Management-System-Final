import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userRole,
    setUserRole,
  } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser({});
    setUserRole("");
    toast.success("Logged out successfully!");
    navigateTo("/");
  };

  const gotoLogin = () => {
    navigateTo("/login");
    setShow(!show);
  };

  const handleLinkClick = () => {
    setShow(!show);
  };

  return (
    <>
      <nav className="container">
        <div className="logo">
          <img
            src="/logo.png"
            alt="logo"
            className="logo-img"
            onClick={() => navigateTo("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={handleLinkClick}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={handleLinkClick}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={handleLinkClick}>
              About Us
            </Link>

            {/* ✅ Show Medical History for logged-in Patients/Doctors */}
            {isAuthenticated &&
              (userRole === "Patient" || userRole === "Doctor") && (
                <Link to={"/medical-history"} onClick={handleLinkClick}>
                  Medical History
                </Link>
              )}

            {/* Show user info */}
            {isAuthenticated && user?.firstName && (
              <span
                className="user-welcome"
                style={{
                  color: "#2d3748",
                  fontWeight: "600",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#f7fafc",
                }}
              >
                Welcome {user.firstName}
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="logoutBtn btn" onClick={gotoLogin}>
              Login
            </button>
          )}
        </div>

        <div className="hamburger" onClick={() => setShow(!show)}>
          {show ? <GiHamburgerMenu /> : <AiOutlineClose />}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
