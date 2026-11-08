import { useEffect, useState } from 'react';
import { 
  fetchTestimonials, 
  getTestimonialName, 
  getTestimonialReview, 
  getTestimonialPhotoUrl, 
  getPlainText 
} from '../utils.js';

export default function TestimonialGrid() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading testimonials...</div>;
  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials-section">
      <h2>Customer Testimonials</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => {
          const name = getTestimonialName(testimonial);
          const photoUrl = getTestimonialPhotoUrl(testimonial);
          const reviewText = getPlainText(getTestimonialReview(testimonial));

          return (
            <div key={testimonial.id || testimonial.documentId} className="testimonial-card">
              {photoUrl && <img src={photoUrl} alt={name} className="testimonial-photo" />}
              <p className="testimonial-review">"{reviewText}"</p>
              <h4 className="testimonial-name">— {name}</h4>
            </div>
          );
        })}
      </div>
    </section>
  );
}