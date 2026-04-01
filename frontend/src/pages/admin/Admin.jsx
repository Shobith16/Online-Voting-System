import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, PieChart, RefreshCcw } from 'lucide-react';
import '../../styles/Admin.css'

const Admin = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="sidebar neumorphic">
        <NavLink to="/Addcandidate" className={({isActive}) => isActive ? "active" : ""}>
          <UserPlus size={20} /> <span>Add Candidate</span>
        </NavLink>
        <NavLink to="/reele" className={({isActive}) => isActive ? "active" : ""}>
          <RefreshCcw size={20} /> <span>Reset Election</span>
        </NavLink>
        <NavLink to="/result" className={({isActive}) => isActive ? "active" : ""}>
          <PieChart size={20} /> <span>Electoral Results</span>
        </NavLink>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default Admin;
