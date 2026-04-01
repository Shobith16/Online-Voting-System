import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Vote as VoteIcon, Building2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Popup from '../../components/Popup';
import '../../styles/Admin.css';

const Overview = () => {
  const [candidates, setCandidates] = useState([]);
  const [votersCount, setVotersCount] = useState(0);
  const [popup, setPopup] = useState({ isOpen: false, type: 'info', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candRes = await api.get('/candidates');
        setCandidates(candRes.data);
        // Assuming we have a way to get voters count, or just total votes for now
        const totalVotes = candRes.data.reduce((sum, c) => sum + (c.Vote || 0), 0);
        setVotersCount(totalVotes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/candidate_del/${id}`);
      setCandidates(candidates.filter(c => c._id !== id));
      setPopup({ isOpen: true, type: 'success', message: 'Candidate removed successfully' });
    } catch (err) {
       setPopup({ isOpen: true, type: 'error', message: 'Failed to delete candidate' });
    }
  };

  return (
    <div className="overview-wrapper">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Real-time election oversight and management</p>
      </div>

      <div className="admin-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card neumorphic">
          <Users className="logo-icon" />
          <h3>Total Candidates</h3>
          <div className="value">{candidates.length}</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card neumorphic">
          <VoteIcon className="logo-icon" />
          <h3>Total Votes cast</h3>
          <div className="value">{votersCount}</div>
        </motion.div>
      </div>

      <div className="admin-table-container neumorphic">
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Manage Candidates</h3>
        {candidates.map((c, idx) => (
          <motion.div 
            key={c._id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: idx * 0.05 }}
            className="admin-item"
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.Candidate}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.Party} | {c.District}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--accent-color)' }}>{c.Vote} Votes</div>
              <button 
                onClick={() => handleDelete(c._id)} 
                className="neumorphic-btn" 
                style={{ height: '40px', width: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Popup isOpen={popup.isOpen} onClose={() => setPopup({ ...popup, isOpen: false })} type={popup.type} message={popup.message} />
    </div>
  );
};

export default Overview;
