import React from 'react';
import { Link, redirect } from 'react-router-dom';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Header = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <header className="header">
      <Navbar className="navbar" expand="md">        
        <div className="container">

          <Navbar.Brand href="/" className=' navbar-brand'>Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
              <Nav className='navbar-links'>
                <Nav.Link  href="/explore" className="navbar-links-buttons">EXPLORE</Nav.Link>
                <Nav.Link href="/contact" className="navbar-links-buttons">LEADERBOARD</Nav.Link>
                <Nav.Link href="/about" className="navbar-links-buttons">ABOUT</Nav.Link>

              {isAuthenticated ? (
                <>
                    <Nav.Link href="/puzzleBuild" className="navbar-links-buttons">CREATE</Nav.Link>
                    <Nav.Link href="/profile" className="navbar-links-buttons">PROFILE</Nav.Link>
                    <Nav.Link className="navbar-links-buttons" onClick={handleSignOut}>SIGN OUT</Nav.Link>
                </>
              ) : (
                  <Nav.Link href="/signin" className="navbar-links-buttons">SIGN IN</Nav.Link>
              )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </header>
  );
};

export default Header;
