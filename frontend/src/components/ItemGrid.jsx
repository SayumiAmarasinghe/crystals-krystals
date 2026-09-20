// frontend/src/components/ItemGrid.jsx
import { usePiecesByCategory } from '../hooks/usePiecesByCategory.js';
import { 
  getPieceName, 
  getPieceDescription, 
  getPiecePhotoUrl, 
  getPlainText,
} from '../utils.js';

export default function ItemGrid({ categoryTitle }) {
  const { items, loading, error } = usePiecesByCategory(categoryTitle);

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
            const name = getPieceName(piece);
            const description = getPieceDescription(piece)
            
            // Extract the first photo URL (prefer thumbnail for grid display if available)
            const photoUrl = getPiecePhotoUrl(piece);

            return (
              <div key={piece.id} className="product-card">
                <div className="image-wrapper">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
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