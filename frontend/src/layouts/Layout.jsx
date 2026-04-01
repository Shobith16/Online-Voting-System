import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Layout({ children }) {
  return (
    <div>
      <Header/>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
