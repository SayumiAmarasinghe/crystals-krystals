import { useEffect, useRef, useState } from 'react';
import {
  fetchTestimonials,
  getTestimonialName,
  getTestimonialReview,
  getTestimonialPhotoUrl,
  getPlainText
} from '../utils.js';
import './TestimonialGrid.css';

export default function TestimonialGrid() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (loading) return <div>Loading testimonials...</div>;
  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials-section">
      <h2>Testimonials</h2>
      <div className="testimonials-carousel">
        <button
          type="button"
          className="testimonial-arrow testimonial-arrow-left"
          onClick={() => scroll(-1)}
          aria-label="Previous testimonials"
        >
          ‹
        </button>

        <div className="testimonials-grid" ref={scrollRef}>
          {testimonials.map((testimonial) => {
            const name = getTestimonialName(testimonial);
            const photoUrl = getTestimonialPhotoUrl(testimonial);
            const reviewText = getPlainText(getTestimonialReview(testimonial));

            return (
              <div
                key={testimonial.id || testimonial.documentId}
                className="testimonial-card"
              >
                {photoUrl && (
                  <img src={photoUrl} alt={name} className="testimonial-photo" />
                )}
                <p className="testimonial-review">"{reviewText}"</p>
                <h4 className="testimonial-name">— {name}</h4>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="testimonial-arrow testimonial-arrow-right"
          onClick={() => scroll(1)}
          aria-label="Next testimonials"
        >
          ›
        </button>
      </div>
    </section>
  );
}