import React, { useState } from 'react';
import '../navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <nav className="navbar-container">
      {/* Brand Logo */}
      <div className="navbar-logo">
        <Link to="/">Crystal&apos;s Krystals</Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        {/* Shop Dropdown */}
        <div
          className="dropdown"
          onMouseEnter={() => setIsShopOpen(true)}
          onMouseLeave={() => setIsShopOpen(false)}
        >
          <Link to="/shop" className="dropdown-toggle">
            Shop
          </Link>
          
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