import React from 'react';
import '../styles/components.css';

const Footer = () => {
  return (
    <footer className="footer">
    <div className="container">
      <p>&copy; {new Date().getFullYear()} Sports App. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer;
