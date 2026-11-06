import { useEffect, useState } from 'react';
import { 
  fetchEvents, 
  getEventName, 
  getEventDescription, 
  getEventPhotoUrl, 
  getEventDate,
  getPlainText 
} from '../utils.js';

export default function EventGrid() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(data => {
        console.log("Full Event Object:", data[0]);
  console.log("Event Name:", getEventName(data[0]));
  console.log("Event Date:", getEventDate(data[0]));
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to midnight

        const upcoming = [];
        const past = [];

        data.forEach(event => {
          const rawDate = getEventDate(event);
          if (!rawDate) return;

          const eventDate = new Date(rawDate);
          if (eventDate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Sort upcoming events soonest first (ascending)
        upcoming.sort((a, b) => new Date(getEventDate(a)) - new Date(getEventDate(b)));

        // Sort past events most recent first (descending)
        past.sort((a, b) => new Date(getEventDate(b)) - new Date(getEventDate(a)));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="events-page-container">
      {/* Upcoming Events Section */}
      <section className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-grid upcoming-grid">
          {upcomingEvents.map((event) => {
            const name = getEventName(event);
            const photoUrl = getEventPhotoUrl(event);
            const descriptionText = getPlainText(getEventDescription(event));
            const rawDate = getEventDate(event);

            const formattedDate = rawDate 
              ? new Date(rawDate).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })
              : '';

            return (
              <div key={event.id || event.documentId} className="event-card">
                <h3>{name}</h3>
                <span className="event-date">{formattedDate}</span>
                {photoUrl && <img src={photoUrl} alt={name} />}
                <p>{descriptionText}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="events-section past-events-section">
        <h2>Past Events</h2>
        <div className="events-grid past-grid">
          {pastEvents.map((event) => {
            const name = getEventName(event);
            const photoUrl = getEventPhotoUrl(event);
            const descriptionText = getPlainText(getEventDescription(event));
            const rawDate = getEventDate(event);

            const formattedDate = rawDate 
              ? new Date(rawDate).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })
              : '';

            return (
              <div key={event.id || event.documentId} className="event-card past-card">
                {photoUrl && <img src={photoUrl} alt={name} />}
                <h3>{name}</h3>
                <span className="event-date">{formattedDate}</span>
                <p>{descriptionText}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}