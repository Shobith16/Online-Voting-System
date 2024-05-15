import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import About from './components/About';
import Admin from './components/Admin';
import Overview from './components/Overview';
import AddC from './components/AddC';
import Result from './components/Result';
import Reele from './components/Reele';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Admin" element={<Admin><Overview /></Admin>} />
        <Route path="/Addcandidate" element={<Admin><AddC /></Admin>} />
        <Route path="/result" element={<Admin><Result /></Admin>} />
        <Route path="/reele" element={<Admin><Reele /></Admin>} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;