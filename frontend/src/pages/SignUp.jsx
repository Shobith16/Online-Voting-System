import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { User, Phone, MapPin, Lock, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Popup from '../components/Popup';
import '../styles/Signup.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [v_id, setV_id] = useState('');
  const [phone, setPhone] = useState('');
  const [State, setSelectedState] = useState('');
  const [District, setSelectedDistrict] = useState('');
  const [Taluk, setSelectedTaluk] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ isOpen: false, type: 'info', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/signup', {
        username, age, v_id, phone, State, District, Taluk, password
      });
      setPopup({
        isOpen: true,
        type: 'success',
        message: 'Registration successful! Redirecting to login...'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.response?.data?.errors?.[0]?.msg) || 'Registration failed';
      setPopup({ isOpen: true, type: 'error', message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card neumorphic signup-card"
      >
        <Link to="/login" className="back-link">
          <ArrowLeft size={18} /> Back to Login
        </Link>
        <h2>Register</h2>
        <p className="subtitle">Secure your digital voter identity</p>

        <form onSubmit={handleSignUp} className="signup-grid">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="input-group">
            <Calendar size={18} className="input-icon" />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>

          <div className="input-group">
            <User size={18} className="input-icon" />
            <input type="text" placeholder="Voter ID" value={v_id} onChange={(e) => setV_id(e.target.value)} required />
          </div>

          <div className="input-group">
            <Phone size={18} className="input-icon" />
            <input type="text" placeholder="Phone (10 digits)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="input-group">
            <MapPin size={18} className="input-icon" />
            <input type="text" placeholder="State" value={State} onChange={(e) => setSelectedState(e.target.value)} required />
          </div>

          <div className="input-group">
            <MapPin size={18} className="input-icon" />
            <input type="text" placeholder="District" value={District} onChange={(e) => setSelectedDistrict(e.target.value)} required />
          </div>

          <div className="input-group full-width">
            <MapPin size={18} className="input-icon" />
            <input type="text" placeholder="Taluk" value={Taluk} onChange={(e) => setSelectedTaluk(e.target.value)} required />
          </div>

          <div className="input-group full-width">
            <Lock size={18} className="input-icon" />
            <input type="password" placeholder="Secure Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-btn neumorphic-btn full-width" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>
      </motion.div>

      <Popup isOpen={popup.isOpen} onClose={() => setPopup({ ...popup, isOpen: false })} type={popup.type} message={popup.message} />
    </div>
  );
};

export default SignUp;
