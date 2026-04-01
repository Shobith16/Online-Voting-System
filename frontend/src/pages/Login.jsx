import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Popup from '../components/Popup';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ isOpen: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      const v_id = response.data.v_id;
      const token = response.data.token;
      
      localStorage.setItem('token', token);
      localStorage.setItem('Voter_id', v_id);

      if (response.data.isAdmin) {
        localStorage.setItem('adminToken', token);
      }

      const checkUserResponse = await api.post('/checkuser', { v_id });

      if (checkUserResponse.data.boolean === "true") {
        setPopup({
          isOpen: true,
          type: 'success',
          message: response.data.isAdmin ? 'Admin access granted. Welcome!' : 'Successfully logged in! You are eligible to vote.'
        });
        setTimeout(() => navigate(response.data.isAdmin ? '/Admin' : '/'), 1500);
      } else {
        setPopup({
          isOpen: true,
          type: 'info',
          message: 'Verification: You have already voted. You can view results but cannot vote again.'
        });
        setTimeout(() => navigate('/'), 2500);
      }
    } catch (err) {
      setPopup({
        isOpen: true,
        type: 'error',
        message: err.response?.data?.message || 'Invalid username or password'
      });
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card neumorphic"
      >
        <h2>Welcome Back</h2>
        <p className="subtitle">Secure login for certified voters</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn neumorphic-btn">
            Login <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <div className="divider"></div>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/signup">Create Account</Link>
        </div>
      </motion.div>

      <Popup 
        isOpen={popup.isOpen} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
        type={popup.type} 
        message={popup.message} 
      />
    </div>
  );
};

export default Login;
