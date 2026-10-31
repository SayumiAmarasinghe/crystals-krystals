import React from 'react';
//import Navbar from '../components/Navbar';
//import Footer from '../components/Footer';
//import './About.css';
import ItemGrid from "../components/ItemGrid.jsx";
import './ShopPages.css';
export default function Home() {
  return (
    <div className="shop-container">
      <main className="page-container">
      {/* Set photosOnly={true} if you only want the images without text */}
      <ItemGrid
        featured={true}
        layout = "grid"
      />
    </main>
    </div>
  );
}