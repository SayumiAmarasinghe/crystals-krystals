import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contact.css';
const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Contact Form</h1>
        <form className="form">
          {/*Name Field*/}
          <div>
            <label>Name:</label>
            <input type="text" id="name" name="name"/>
          </div>

          {/*Email Field*/}
          <div>
            <label>Email:</label>
            <input type="text" id="email" name="email"/>
          </div>
         
          {/*Message Field*/}
          <div>
            <label>Message:</label>
            <textarea id="message" name="message" rows="5"></textarea>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>

        

        {/*Contact Us*/}
        <div>
          <h2>Contact Us</h2>
          <p>Instagram @crystals.krystals</p>
          <p>https://www.instagram.com/crystals.krystals/</p>
        </div>
    </div>
  );
};

export default Contact;