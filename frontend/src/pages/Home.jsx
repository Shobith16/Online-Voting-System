import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Home.css';
import { motion } from 'framer-motion';
import { User, MapPin, Award, CheckCircle2 } from 'lucide-react';
import Popup from '../components/Popup';

const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: 'info', message: '', onConfirm: null });
  const v_id = localStorage.getItem('Voter_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/candidates');
        setCandidates(response.data);

        if (v_id) {
          const checkUserResponse = await api.post('/checkuser', { v_id });
          if (checkUserResponse.data.boolean === "false") {
            setHasVoted(true);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [v_id]);

  const initiateVote = (candidateId, candidateName) => {
    if (hasVoted) return;
    
    setPopup({
      isOpen: true,
      type: 'confirm',
      message: `Are you sure you want to cast your vote for ${candidateName}? This action is final.`,
      onConfirm: () => executeVote(candidateId, candidateName)
    });
  };

  const executeVote = async (candidateId, candidateName) => {
    try {
      await api.post(`/candidates/${candidateId}/vote`, {});
      
      if (v_id) {
        await api.post('/finishedvotinglist', { v_id });
      }

      setHasVoted(true);
      setPopup({
        isOpen: true,
        type: 'success',
        message: `Successfully cast your vote for ${candidateName}!`,
        onConfirm: null
      });
    } catch (error) {
      setPopup({
        isOpen: true,
        type: 'error',
        message: 'Failed to cast vote. Please try again.',
        onConfirm: null
      });
    }
  };

  return (
    <div className="home-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="home-header"
      >
        <h1>Election 2026</h1>
        <p>Cast your vote securely using our encrypted platform.</p>
      </motion.div>

      <div className="candidate-grid">
        {candidates.map((candidate, index) => (
          <motion.div 
            key={candidate._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`candidate-card neumorphic ${hasVoted ? 'voted-state' : ''}`}
          >
            <div className="card-header">
              <Award className="award-icon" />
              <div className="party-badge">{candidate.Party}</div>
            </div>

            <div className="candidate-info">
              <h2 className="bold-text">{candidate.Candidate}</h2>
              <div className="detail-row">
                <MapPin size={16} /> <span>{candidate.District}, {candidate.State}</span>
              </div>
              <div className="detail-row">
                <User size={16} /> <span>{candidate.Taluk} | Age: {candidate.Age}</span>
              </div>
            </div>

            <button 
              className={`vote-btn neumorphic-btn ${hasVoted ? 'disabled' : ''}`}
              onClick={() => initiateVote(candidate._id, candidate.Candidate)} 
              disabled={hasVoted}
            >
              {hasVoted ? <><CheckCircle2 size={18} /> Voted</> : 'Cast Vote'}
            </button>
          </motion.div>
        ))}
      </div>

      <Popup 
        isOpen={popup.isOpen} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
        onConfirm={popup.onConfirm}
        type={popup.type} 
        message={popup.message} 
        showCancel={popup.type === 'confirm'}
      />
    </div>
  );
};

export default Home;
