import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
//import './About.css';
import ItemGrid from '../components/ItemGrid';
import './ShopPages.css';
export default function HairAccessories() {
  return (
    <div className="hairaccessories-page shop-container">
        <main className="page-container">
          <ItemGrid categoryTitle="Hair Accessories" layout="grid" />
        </main>
    </div>
  );
};