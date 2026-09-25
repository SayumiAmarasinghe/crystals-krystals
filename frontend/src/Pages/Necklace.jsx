import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemGrid from '../components/ItemGrid';
//import './About.css';
import './ShopPages.css';
export default function Necklaces() {
  return (
    <div className="necklace-page shop-container">
        <main className="necklace-main">
          <ItemGrid categoryTitle="Necklaces" />
        </main>
    </div>
  );
};

