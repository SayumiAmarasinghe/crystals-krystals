import React from 'react';
import ItemGrid from "../components/ItemGrid.jsx";
import TestimonialGrid from "../components/TestimonialGrid.jsx";
import './ShopPages.css';
import './Home.css';

export default function Home() {
  return (
    <div className="shop-container">
      <section
        className="home-hero"
        style={{ backgroundImage: "url('/images/seasonal-hero.jpg')" }}
      >
        <div className="home-hero-content">
          <h2>Seasonal Items</h2>
          <a className="btn-main" href="/shop">View More</a>
        </div>
      </section>

      <main className="page-container">
        <section className="home-section">
          <h2 className="home-section-title">Featured Items</h2>
          <ItemGrid featured={true} layout="grid" />
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Brand Story</h2>
          <p className="home-brand-story">
            Replace this with Crystal's story.
          </p>
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Testimonials</h2>
          <TestimonialGrid />
        </section>
      </main>
    </div>
  );
}