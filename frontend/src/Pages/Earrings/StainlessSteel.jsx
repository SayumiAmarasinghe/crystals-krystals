import React from "react";
import ItemGrid from "../../components/ItemGrid.jsx";
import "../ShopPages.css";

export default function StainlessSteelEarrings() {
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
