import { useEffect, useRef, useState } from 'react';
import {
  fetchTestimonials,
  getTestimonialName,
  getTestimonialReview,
  getTestimonialPhotoUrl,
  getPlainText
} from '../utils.js';
import './TestimonialGrid.css';

const SLOTS = 7; // 1 hidden on the left + up to 4 visible + extras on the right

export default function TestimonialGrid() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(0);       // which testimonial is first in view
  const [units, setUnits] = useState(1);       // 1 = resting, 2 = sliding next, 0 = sliding prev
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
    if (animating) return;
    setAnimating(true);
    setUnits(dir > 0 ? 2 : 0);
  };

  // After the slide finishes, rotate the list and snap back to rest (no animation)
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || !animating) return;
    if (units === 2) setStart((s) => (s + 1) % n);
    if (units === 0) setStart((s) => (s - 1 + n) % n);
    setAnimating(false);
    setUnits(1);
  };

  if (loading) return <div>Loading testimonials...</div>;
  if (n === 0) return null;

  const slots = Array.from({ length: SLOTS }, (_, i) => {
    return testimonials[(((start + i - 1) % n) + n) % n];
  });

  return (
    <section className="testimonials-section">
      <h2>Testimonials</h2>
      <div className="testimonials-carousel">
        <button
          type="button"
          className="testimonial-arrow testimonial-arrow-left"
          onClick={() => slide(-1)}
          aria-label="Previous testimonials"
        >
          ‹
        </button>

        <div className="testimonials-grid">
          <div
            className={`testimonials-track${animating ? ' is-animating' : ''}`}
            style={{ '--u': units }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slots.map((testimonial, i) => {
              const name = getTestimonialName(testimonial);
              const photoUrl = getTestimonialPhotoUrl(testimonial);
              const reviewText = getPlainText(getTestimonialReview(testimonial));

              return (
                <div key={i} className="testimonial-card">
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

        <button
          type="button"
          className="testimonial-arrow testimonial-arrow-right"
          onClick={() => slide(1)}
          aria-label="Next testimonials"
        >
          ›
        </button>
      </div>
    </section>
  );
} 