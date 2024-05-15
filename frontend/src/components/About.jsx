import React from 'react';
import '../styles/About.css';
const About = () => {
  return (
    <div className="aboutContainer">
      <h1 className="title">About Us</h1>
      <p className='p'>This is a simple online voting system built using React.</p>
      <p className='p'>The system allows users to vote for their favorite programming language.</p>
      <p className='p'>The votes are updated in real-time using websockets.</p>
    </div>
  );
};

export default About;