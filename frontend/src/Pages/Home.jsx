import React from 'react';
import ItemGrid from "../components/ItemGrid.jsx";
import TestimonialGrid from "../components/TestimonialGrid.jsx";
import heroImg from "../assets/seasonal-hero.jpg";
import './ShopPages.css';
import './Home.css';

export default function Home() {
  return (
    <div className="shop-container home-page">
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="home-hero-content">
          <h2>Seasonal Items</h2>
          <a className="btn-main" href="/shop">View More</a>
        </div>
      </section>

      <main className="page-container">
        <section className="home-section">
          <ItemGrid featured={true} />
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Brand Story</h2>
          <p className="home-brand-story">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>

        <section className="home-section">
          <TestimonialGrid />
        </section>
      </main>
    </div>
  );
}