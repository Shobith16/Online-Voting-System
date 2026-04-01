import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Lock, Smartphone, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [v_id, setV_id] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await api.post('/reset-password', {
        v_id,
        phone,
        newPassword
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container dark-mode">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card neumorphic"
      >
        <Link to="/login" className="back-link">
          <ArrowLeft size={20} /> Back to Login
        </Link>
        <h2>Reset Password</h2>
        <p className="subtitle">Verify your identity to set a new password</p>
        
        <form onSubmit={handleReset}>
          <div className="input-group">
            <UserIcon size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Voter ID" 
              value={v_id} 
              onChange={(e) => setV_id(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <Smartphone size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit" className="auth-btn neumorphic-btn">
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
