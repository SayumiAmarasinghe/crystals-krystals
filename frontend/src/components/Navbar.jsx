import React, { useState } from 'react';
import '../navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to track if the Shop dropdown is open
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Function to toggle the dropdown when "Shop" is clicked
  const toggleShop = (e) => {
    e.preventDefault(); 
    setIsShopOpen(!isShopOpen);
  };

  return (
    <nav className="navbar-container">
      {/* Brand Logo */}
      <div className="navbar-logo">
        <Link to="/">Crystal's Krystals</Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        {/* Shop Dropdown */}
        <div className="dropdown" onMouseLeave={() => setIsShopOpen(false)}>
          <button 
            className="dropdown-toggle" 
            onClick={toggleShop}
            aria-haspopup="true"
            aria-expanded={isShopOpen}
          >
            Shop
          </button>
          
          {/* The Dropdown Menu */}
          {isShopOpen && (
            <div className="dropdown-menu">
              <Link to="/shop/earrings">Earrings</Link>
              <Link to="/shop/necklaces">Necklaces</Link>
              <Link to="/shop/rings">Rings</Link>
              <Link to="/shop/miscellaneous">Miscellaneous</Link>
            </div>
          )}
        </div>

        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;