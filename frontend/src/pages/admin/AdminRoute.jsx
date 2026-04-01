import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    // Redirect to login if not authenticated as admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
