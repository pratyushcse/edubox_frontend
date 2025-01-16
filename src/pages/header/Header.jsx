import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "./logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-logo-section">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
        <Link to="/" className="header-site-name" onClick={closeMenu}>
          EduBox
        </Link>
      </div>

      {/* Hamburger menu */}
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation menu */}
      <nav className={`header-nav ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="header-nav-link" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/about" className="header-nav-link" onClick={closeMenu}>
          About
        </Link>
        <Link to="/notes" className="header-nav-link" onClick={closeMenu}>
          Notes
        </Link>
        <Link to="/questionpaper" className="header-nav-link" onClick={closeMenu}>
          Question Paper
        </Link>
        <Link to="/contact" className="header-nav-link" onClick={closeMenu}>
          Contact Us
        </Link>
      </nav>
    </header>
  );
};

export default Header;
