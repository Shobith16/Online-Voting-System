import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Admin from './pages/admin/Admin';
import Overview from './pages/admin/Overview';
import AddC from './pages/admin/AddC';
import Result from './pages/admin/Result';
import Reele from './pages/admin/Reele';
import AdminRoute from './pages/admin/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Admin" element={<AdminRoute><Admin><Overview /></Admin></AdminRoute>} />
        <Route path="/Addcandidate" element={<AdminRoute><Admin><AddC /></Admin></AdminRoute>} />
        <Route path="/result" element={<AdminRoute><Admin><Result /></Admin></AdminRoute>} />
        <Route path="/reele" element={<AdminRoute><Admin><Reele /></Admin></AdminRoute>} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;