import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Vote, Info, User } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('Voter_id');
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="navbar neumorphic"
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Vote className="logo-icon" /> 
          <span>VOTE<span>CORE</span></span>
        </Link>

        <div className="nav-links">
          {(token || adminToken) ? (
            <>
              {adminToken && <Link to="/Admin" className="nav-admin-link">Admin Panel</Link>}
              <Link to="/"><User size={18} /> Dashboard</Link>
              <Link to="/about"><Info size={18} /> About</Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="nav-btn neumorphic-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
