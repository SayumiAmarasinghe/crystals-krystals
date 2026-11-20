import { useEffect, useState } from 'react';
import { 
  fetchEvents, 
  getEventName, 
  getEventDescription, 
  getEventPhotoUrl, 
  getEventDate,
  getPlainText 
} from '../utils.js';
import "./EventGrid.css";

export default function EventGrid() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(data => {
        // Get today's date formatted as YYYY-MM-DD in local time to avoid timezone offset bugs
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        const upcoming = [];
        const past = [];

        data.forEach(event => {
          const rawDate = getEventDate(event);
          
          // Defensive fallback: If an event has no date, push it to upcoming as TBA
          if (!rawDate) {
            upcoming.push(event);
            return;
          }

          // Safely extract the YYYY-MM-DD portion of the date string to prevent timezone shifts
          // (Handles both full ISO strings "2026-06-05T00:00:00.000Z" and "2026-06-05")
          const cleanDateString = String(rawDate).split('T')[0];
          const parsedCheck = new Date(cleanDateString);

          if (isNaN(parsedCheck.getTime())) {
            // If the date string is malformed, treat it safely as TBA
            upcoming.push(event);
            return;
          }

          // String comparison (YYYY-MM-DD) is immune to browser timezone bugs
          if (cleanDateString >= todayString) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Sort upcoming events soonest first, pushing TBA to the bottom
        upcoming.sort((a, b) => {
          const dateA = getEventDate(a);
          const dateB = getEventDate(b);
          if (!dateA) return 1; 
          if (!dateB) return -1;
          return new Date(String(dateA).split('T')[0]) - new Date(String(dateB).split('T')[0]);
        });

        // Sort past events most recent first
        past.sort((a, b) => {
          const dateA = getEventDate(a);
          const dateB = getEventDate(b);
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(String(dateB).split('T')[0]) - new Date(String(dateA).split('T')[0]);
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

  // Helper to format date strings safely without timezone sliding
  const formatEventDate = (rawDate) => {
    if (!rawDate) return 'Date TBA';
    const cleanStr = String(rawDate).split('T')[0];
    const [y, m, d] = cleanStr.split('-');
    if (!y || !m || !d) return 'Date TBA';
    
    // Construct UTC date to render components cleanly
    const utcDate = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    if (isNaN(utcDate.getTime())) return 'Date TBA';

    return utcDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

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
            const formattedDate = formatEventDate(rawDate);

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
            const formattedDate = formatEventDate(rawDate);

            return (
              <div key={event.id || event.documentId} className="event-card past-card">
                <h3>{name}</h3>
                <span className="event-date">{formattedDate}</span>
                {photoUrl && <img src={photoUrl} alt={name} />}
                <p>{descriptionText}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}