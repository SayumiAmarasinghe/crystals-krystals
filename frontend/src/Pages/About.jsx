import React from 'react';
import './About.css';

import logo from '../assets/fonts/About Photos/crystal-transparent-logo.png';
import crystalEarrings from '../assets/fonts/About Photos/crystal-earrings.jpg';
import crystalBooth from '../assets/fonts/About Photos/Crystal in front of booth.webp';

// Team photos
import crystalPhoto from '../assets/team/Crystal  Duran .png';
import sayumiPhoto from '../assets/team/Sayumi Amarasinghe.jpg';
import rebeccaPhoto from '../assets/team/Rebecca L. Smith.jpg';
import erinPhoto from '../assets/team/Erin Lee.jpg';
import elenaPhoto from '../assets/team/Elena Sorn.jpeg';
import janicePhoto from '../assets/team/Janice Lachan.jpeg';
import lindsayPhoto from '../assets/team/Lindsay Kislingbury.jpg';
import emilyPhoto from '../assets/team/Emily Quon.jpg';

const teamMembers = [
  {
    id: 1,
    name: "Crystal Duran",
    role: "Owner",
    image: crystalPhoto,
    description: "Owner."
  },
  {
    id: 2,
    name: "Sayumi Amarasinghe",
    role: "Senior Contributor",
    image: sayumiPhoto,
    description: "Senior with a love of web development and fantasy books."
  },
  {
    id: 3,
    name: "Rebecca L. Smith",
    role: "Aspiring Software Developer",
    image: rebeccaPhoto,
    description: "Aspiring Software Developer who also enjoys flowering and painting on the side."
  },
  {
    id: 4,
    name: "Erin Lee",
    role: "UX Designer",
    image: erinPhoto,
    description: "UX designer with a love of art and music."
  },
  {
    id: 5,
    name: "Elena Sorn",
    role: "Front-End Contributor",
    image: elenaPhoto,
    description: "Front-End Contributor, Senior, CIS, IR."
  },
  {
  id: 6,
  name: "Emily Quon",
  role: "Frontend Contributor",
  image: emilyPhoto,
  description: "Upcoming sophomore with an interest in cybersecurity who enjoys playing badminton, reading romance novels, and watching K-dramas."
},
{
  id: 7,
  name: "Lindsay Kislingbury",
  role: "Software Engineer",
  image: lindsayPhoto,
  description: "Software engineer, and pulp sci-fi enthusiast."
},
{
  id: 8,
  name: "Janice Lachan",
  role: "Aspiring Software Engineer",
  image: janicePhoto,
  description: "A rising senior aspiring to become a software engineer with interests in web development and robotics."
},
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
              <img
                src={member.image}
                alt={member.name}
                className="team-photo"
              />

              <h3>{member.name}</h3>

              <p>{member.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;