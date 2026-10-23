import React from "react";
import ItemGrid from "../../components/ItemGrid.jsx";
import "../ShopPages.css";

export default function GoldFilledEarrings() {
  return (
    <div className="shop-container">
      <main className="page-container">
        <ItemGrid
          categoryTitle="Earrings"
          material="Gold Filled"
          layout="grid"
        />
      </main>
    </div>
  );
}
