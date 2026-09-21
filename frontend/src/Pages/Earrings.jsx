import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemGrid from '../components/ItemGrid';
//import './About.css';
import './ShopPages.css';

export default function Earrings() {
  
  return (
    <div className="shop-container">
      <main className="page-container">
        <ItemGrid categoryTitle="Earrings" />
      </main>
    </div>
  );
}