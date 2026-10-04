import React from "react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ItemGrid from "../../components/ItemGrid.jsx";
//import './About.css';
import "../ShopPages.css";

export default function StainlessSteel() {
  return (
    <div className="shop-container">
      <main className="page-container">
        <ItemGrid
          categoryTitle="Earrings"
          material="Stainless Steel"
          layout="grid"
        />
      </main>
    </div>
  );
}
