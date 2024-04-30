import React from 'react';
import { Link, redirect } from 'react-router-dom';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    auth.signOut();
    navigate('/homepage');
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">HOME</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">HOME</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">EXPLORE</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">LEADERBOARD</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link to="/puzzleBuild" className="nav-link">CREATE</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">PROFILE</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleSignOut}>SIGN OUT</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/signin" className="nav-link">SIGN IN</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
