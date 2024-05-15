import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Header from './Header';

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
