import { useEffect, useState } from 'react';
import {
  fetchTestimonials,
  getTestimonialName,
  getTestimonialReview,
  getTestimonialPhotoUrl,
  getPlainText
} from '../utils.js';
import './TestimonialGrid.css';

const SLOTS = 7;
const CAROUSEL_THRESHOLD = 4;

export default function TestimonialGrid() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(0);
  const [units, setUnits] = useState(1);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetchTestimonials()
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load testimonials:", err);
        setLoading(false);
      });
  }, []);

  const n = testimonials.length;

  const slide = (dir) => {
    if (animating || n <= CAROUSEL_THRESHOLD) return;
    setAnimating(true);
    setUnits(dir > 0 ? 2 : 0);
  };

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || !animating) return;
    if (units === 2) setStart((s) => (s + 1) % n);
    if (units === 0) setStart((s) => (s - 1 + n) % n);
    setAnimating(false);
    setUnits(1);
  };

  if (loading) return <div>Loading testimonials...</div>;
  if (n === 0) return null;

  const isCarousel = n > CAROUSEL_THRESHOLD;

  // Generate slots for carousel, or exact items for static view
  const itemsToRender = isCarousel
    ? Array.from({ length: SLOTS }, (_, i) => {
        const dataIndex = (((start + i - 1) % n) + n) % n;
        return {
          item: testimonials[dataIndex],
          uniqueKey: `${dataIndex}-${i}`
        };
      })
    : testimonials.map((item, i) => ({ item, uniqueKey: `${i}` }));

  return (
    <section className="testimonials-section">
      <h2>Testimonials</h2>
      <div className={`testimonials-carousel ${!isCarousel ? 'is-static' : ''}`}>
        
        {isCarousel && (
          <button
            type="button"
            className="testimonial-arrow testimonial-arrow-left"
            onClick={() => slide(-1)}
            aria-label="Previous testimonials"
          >
            ‹
          </button>
        )}

        <div className="testimonials-grid">
          <div
            className={`testimonials-track${animating ? ' is-animating' : ''} ${!isCarousel ? 'static-track' : ''}`}
            style={isCarousel ? { '--u': units } : undefined}
            onTransitionEnd={handleTransitionEnd}
          >
            {itemsToRender.map(({ item, uniqueKey }) => {
              const name = getTestimonialName(item);
              const photoUrl = getTestimonialPhotoUrl(item);
              const reviewText = getPlainText(getTestimonialReview(item));

              return (
                <div key={uniqueKey} className="testimonial-card">
                  {photoUrl && (
                    <img src={photoUrl} alt={name} className="testimonial-photo" />
                  )}
                  <p className="testimonial-review">"{reviewText}"</p>
                  <h4 className="testimonial-name">— {name}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {isCarousel && (
          <button
            type="button"
            className="testimonial-arrow testimonial-arrow-right"
            onClick={() => slide(1)}
            aria-label="Next testimonials"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}