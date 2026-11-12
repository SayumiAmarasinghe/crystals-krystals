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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to midnight

        const upcoming = [];
        const past = [];

        data.forEach(event => {
          const rawDate = getEventDate(event);
          
          // Defensive fallback: If an event has no date, don't drop it. 
          // Push it to upcoming by default so it stays visible as TBA.
          if (!rawDate) {
            upcoming.push(event);
            return;
          }

          const eventDate = new Date(rawDate);
          if (eventDate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Sort upcoming events soonest first (ascending), handling missing dates safely
        upcoming.sort((a, b) => {
          const dateA = getEventDate(a);
          const dateB = getEventDate(b);
          if (!dateA) return 1;  // Push TBA items to the bottom of upcoming
          if (!dateB) return -1;
          return new Date(dateA) - new Date(dateB);
        });

        // Sort past events most recent first (descending), handling missing dates safely
        past.sort((a, b) => {
          const dateA = getEventDate(a);
          const dateB = getEventDate(b);
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(dateB) - new Date(dateA);
        });

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

            // Fallback to 'Date TBA' if the date is missing
            const formattedDate = rawDate 
              ? new Date(rawDate).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })
              : 'Date TBA';

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
              : 'Date TBA';

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