import { useRef, useState, useEffect } from "react";
import { usePiecesByCategory } from "../hooks/usePiecesByCategory.js";
import {
  getPieceName,
  getPieceDescription,
  getPiecePhotoUrl,
  getPlainText,
} from "../utils.js";
import "./ItemGrid.css";

export default function ItemGrid({
  categoryTitle,
  material,
  layout = "carousel",
}) {
  const { items, loading, error } = usePiecesByCategory(
    categoryTitle,
    material,
  );
  const heading = material ? `${material} ${categoryTitle}` : categoryTitle;
  const railRef = useRef(null);
  
  const [showAll, setShowAll] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  
  const isCarousel = layout === "carousel";
  const showGrid = !isCarousel || showAll;

  // Checks if the grid's total scrolling width is larger than its visible width
  useEffect(() => {
    const checkScrollability = () => {
      const rail = railRef.current;
      if (rail) {
        // scrollWidth is total content size, clientWidth is visible size
        setCanScroll(rail.scrollWidth > rail.clientWidth);
      }
    };

    // Check when component mounts or when items/layout changes
    checkScrollability();

    // Re-check if the user resizes their browser window
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [items, showGrid]);

  function scrollItems(direction) {
    const rail = railRef.current;
    if (!rail || items.length === 0) return;

    const cardWidth = rail.children[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(window.getComputedStyle(rail).columnGap) || 0;
    const itemStep = cardWidth + gap;
    if (!itemStep) return;

    let currentIndex = Math.round(rail.scrollLeft / itemStep);
    let nextIndex = currentIndex + direction;

    // Prevents scrolling past the beginning or end
    nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));

    rail.scrollTo({
      left: rail.children[nextIndex].offsetLeft - rail.offsetLeft,
      behavior: "smooth",
    });
  }

  if (loading) return <div className="loading-state">Loading {heading}...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <section className="category-section">
      <h2>{heading}</h2>

      {items.length === 0 ? (
        <p className="empty-state">
          No pieces available in {heading} right now. Check back soon!
        </p>
      ) : (
        <>
          {isCarousel && (
            <div className="item-grid-toolbar">
              <button
                type="button"
                className="items-view-toggle"
                aria-expanded={showAll}
                onClick={() => setShowAll((current) => !current)}
              >
                {showAll ? "Show carousel" : "Show all"}
              </button>
            </div>
          )}
          <div className="product-grid-frame">
            <div
              ref={railRef}
              className={
                showGrid
                  ? "product-grid product-grid-all"
                  : "product-grid product-grid-carousel"
              }
            >
              {items.map((piece, index) => {
                const name = getPieceName(piece);
                const description = getPieceDescription(piece);
                const photoUrl = getPiecePhotoUrl(piece);

                return (
                  <div key={`${piece.id || index}`} className="product-card">
                    <div className="image-wrapper">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={name || "Jewelry piece"}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image-placeholder">No Image</div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{name}</h3>
                      <p className="product-description">
                        {getPlainText(description)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Arrows only render if it's a carousel, not showing all, AND overflowing */}
            {isCarousel && !showAll && canScroll && (
              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-arrow"
                  aria-label={`Show previous ${heading.toLowerCase()} items`}
                  onClick={() => scrollItems(-1)}
                >
                  <span
                    className="arrow-icon arrow-icon-previous"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="carousel-arrow"
                  aria-label={`Show next ${heading.toLowerCase()} items`}
                  onClick={() => scrollItems(1)}
                >
                  <span
                    className="arrow-icon arrow-icon-next"
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}