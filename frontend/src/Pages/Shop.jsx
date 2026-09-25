import React from 'react';
import ItemGrid from '../components/ItemGrid';
import './ShopPages.css';

const categories = ['Earrings', 'Necklaces', 'Rings', 'Miscellaneous'];

const Shop = () => {
  return (
    <div className="shop-container shop-page">
      <main className="page-container">
        {categories.map((category) => (
          <ItemGrid key={category} categoryTitle={category} />
        ))}
      </main>
    </div>
  );
};

export default Shop;