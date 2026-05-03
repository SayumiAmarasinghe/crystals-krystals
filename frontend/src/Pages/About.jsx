import React from 'react';
import './About.css';

import logo from '../assets/fonts/About Photos/crystal-transparent-logo.png';
import crystalEarrings from '../assets/fonts/About Photos/crystal-earrings.jpg';
import crystalBooth from '../assets/fonts/About Photos/Crystal in front of booth.webp';

const teamMembers = [
  { id: 1, color: 'dark' },
  { id: 2, color: 'cream' },
  { id: 3, color: 'pink' },
  { id: 4, color: 'cream' },
  { id: 5, color: 'pink' },
  { id: 6, color: 'dark' },
  { id: 7, color: 'pink' },
  { id: 8, color: 'dark' },
  { id: 9, color: 'cream' },
];

const About = () => {
  return (
    <main className="about-page">
      <section className="about-top">
        <div className="about-copy">
          <h1>About</h1>

          <p>
            Crystal&apos;s Krystals – Jewelry is a small, locally owned
            handmade jewelry brand founded by Crystal Duran in Southern
            California.
          </p>

          <p>
            Each piece is carefully designed with love and attention to detail
            using materials such as polymer clay, beads, and gold-filled metals.
          </p>

          <p>
            The brand focuses on creating unique, stylish, and meaningful
            jewelry that customers can wear for everyday looks, special
            occasions, gifts, and seasonal events.
          </p>
        </div>

        <div className="about-logo-area">
          <img
            src={logo}
            alt="Crystal's Krystals logo"
            className="about-logo"
          />
        </div>
      </section>

      <section className="mission">
        <h2>Mission</h2>

        <p>
          The mission of Crystal&apos;s Krystals is to showcase handmade jewelry
          collections, highlight the handmade process, and build a strong brand
          identity through soft, feminine, and creative designs.
        </p>

      </section>

      <section className="about-photos">
        <img
          src={crystalEarrings}
          alt="Crystal's Krystals handmade earrings"
          className="about-photo"
        />

        <img
          src={crystalBooth}
          alt="Crystal standing in front of the Crystal's Krystals booth"
          className="about-photo"
        />
      </section>

      <section className="team">
        <h2>Team</h2>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.id}>
              <div className={`team-circle ${member.color}`}></div>

              <h3>Name</h3>

              <p>
                &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;