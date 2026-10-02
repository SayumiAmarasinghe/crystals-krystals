import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import ItemGrid from '../../components/ItemGrid.jsx';
//import './About.css';
import '../ShopPages.css';

export default function Earrings() {
  
  return (
    <div className="shop-container">
      <main className="page-container">
        <ItemGrid categoryTitle="Earrings" layout="grid" />
      </main>
    </div>
  );
}