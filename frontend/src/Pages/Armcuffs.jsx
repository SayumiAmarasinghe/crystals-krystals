import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
//import './About.css';
import ItemGrid from '../components/ItemGrid';
import './ShopPages.css';

export default function Armcuffs() {
  return (
    <div className="armcuffs-page shop-container">
        <main className="page-container">
          <ItemGrid categoryTitle="Armcuffs" layout="grid" />
        </main>
    </div>
  );
};