// frontend/src/components/ItemGrid.jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { usePiecesByCategory } from '../hooks/usePiecesByCategory.js';
import { 
  getPieceName, 
  getPieceDescription, 
  getPiecePhotoUrl, 
  getPlainText,
} from '../utils.js';
import './ItemGrid.css';

export default function ItemGrid({ categoryTitle }) {
  const { items, loading, error } = usePiecesByCategory(categoryTitle);
  const railRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const carouselItems = showAll ? items : [...items, ...items, ...items];

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || showAll || items.length === 0) return;

    const middleCopyStart = rail.children[items.length];
    if (middleCopyStart) {
      rail.scrollLeft = middleCopyStart.offsetLeft - rail.offsetLeft;
    }
  }, [items.length, showAll]);

  function scrollItems(direction) {
    const rail = railRef.current;
    if (!rail || items.length === 0) return;

    const cardWidth = rail.children[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(window.getComputedStyle(rail).columnGap) || 0;
    const itemStep = cardWidth + gap;
    if (!itemStep) return;

    let currentIndex = Math.round(rail.scrollLeft / itemStep);
    let nextIndex = currentIndex + direction;
    const nextCard = rail.children[nextIndex];
    const nextPosition = nextCard?.offsetLeft - rail.offsetLeft;
    const maxScroll = rail.scrollWidth - rail.clientWidth;

    if (direction > 0 && nextPosition > maxScroll) {
      currentIndex -= items.length;
      rail.scrollLeft = rail.children[currentIndex].offsetLeft - rail.offsetLeft;
      nextIndex = currentIndex + 1;
    } else if (direction < 0 && (nextIndex < 0 || nextPosition < 0)) {
      currentIndex += items.length;
      rail.scrollLeft = rail.children[currentIndex].offsetLeft - rail.offsetLeft;
      nextIndex = currentIndex - 1;
    }

    rail.scrollTo({
      left: rail.children[nextIndex].offsetLeft - rail.offsetLeft,
      behavior: 'smooth',
    });
  }

  if (loading) return <div className="loading-state">Loading {categoryTitle}...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <section className="category-section">
      <h2>{categoryTitle}</h2>

      {items.length === 0 ? (
        <p className="empty-state">No pieces available in {categoryTitle} right now. Check back soon!</p>
      ) : (
        <>
          <div className="item-grid-toolbar">
            <button
              type="button"
              className="items-view-toggle"
              aria-expanded={showAll}
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? 'Show carousel' : 'Show all'}
            </button>
          </div>
          <div className="product-grid-frame">
            <div
              ref={railRef}
              className={showAll ? 'product-grid product-grid-all' : 'product-grid product-grid-carousel'}
            >
              {carouselItems.map((piece, index) => {
                // Support both direct root fields and Strapi v4 nested attributes
                const name = getPieceName(piece);
                const description = getPieceDescription(piece)

                // Extract the first photo URL (prefer thumbnail for grid display if available)
                const photoUrl = getPiecePhotoUrl(piece);

                return (
                  <div key={`${piece.id}-${index}`} className="product-card">
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
            {!showAll && items.length > 1 && (
              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-arrow"
                  aria-label={`Show previous ${categoryTitle.toLowerCase()} items`}
                  onClick={() => scrollItems(-1)}
                >
                  <span className="arrow-icon arrow-icon-previous" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="carousel-arrow"
                  aria-label={`Show next ${categoryTitle.toLowerCase()} items`}
                  onClick={() => scrollItems(1)}
                >
                  <span className="arrow-icon arrow-icon-next" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}