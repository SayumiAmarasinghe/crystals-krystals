// frontend/src/components/ItemGrid.jsx
import React, { useState, useEffect } from 'react';
import { STRAPI_URL, getPlainText } from '../utils';

export default function ItemGrid({ categoryTitle }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPieces() {
      try {
        setLoading(true);
        const res = await fetch(`${STRAPI_URL}/api/pieces?populate=*`);
        if (!res.ok) throw new Error('Failed to load items');
        
        const data = await res.json();
        
        // Filter pieces by the selected category name (case-insensitive)
        const filtered = (data.data || []).filter((piece) => {
          const pieceCategory = piece.category?.Name || piece.attributes?.category?.data?.attributes?.Name;
          return pieceCategory?.toLowerCase() === categoryTitle.toLowerCase();
        });

        setItems(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPieces();
  }, [categoryTitle]);

  if (loading) return <div className="loading-state">Loading {categoryTitle}...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <section className="category-section">
      <h2>{categoryTitle}</h2>

      {items.length === 0 ? (
        <p className="empty-state">No pieces available in {categoryTitle} right now. Check back soon!</p>
      ) : (
        <div className="product-grid">
          {items.map((piece) => {
            // Support both direct root fields and Strapi v4 nested attributes
            const name = piece.Name || piece.attributes?.Name;
            const description = piece.Description || piece.attributes?.Description;
            const photos = piece.Photo || piece.attributes?.Photo?.data || [];
            
            // Extract the first photo URL (prefer thumbnail for grid display if available)
            const firstPhoto = Array.isArray(photos) ? photos[0] : photos;
            const photoUrl = firstPhoto?.formats?.medium?.url 
              || firstPhoto?.formats?.thumbnail?.url 
              || firstPhoto?.url 
              || firstPhoto?.attributes?.url;

            return (
              <div key={piece.id} className="product-card">
                <div className="image-wrapper">
                  {photoUrl ? (
                    <img
                      src={`${STRAPI_URL}${photoUrl}`}
                      alt={name || 'Jewelry piece'}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{name}</h3>
                  <p className="product-description">{getPlainText(description)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}