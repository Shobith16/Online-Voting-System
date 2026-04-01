import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Zap, Globe } from 'lucide-react';
import '../styles/About.css';

const About = () => {
  const features = [
    { icon: <ShieldCheck size={24} />, title: 'Highly Secure', text: 'End-to-end encryption for every vote cast.' },
    { icon: <Zap size={24} />, title: 'Real-time Results', text: 'Live updates with zero latency.' },
    { icon: <Globe size={24} />, title: 'Accessible', text: 'Designed for everyone, everywhere.' },
  ];

  return (
    <div className="about-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="about-card neumorphic"
      >
        <div className="about-header">
          <Info size={48} className="logo-icon" />
          <h1>About VoteCore</h1>
        </div>
        
        <p className="about-p">
          VoteCore is a next-generation online voting system built with the MERN stack. 
          Our mission is to provide a transparent, immutable, and user-friendly platform for digital democracy.
        </p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item neumorphic-inset">
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;