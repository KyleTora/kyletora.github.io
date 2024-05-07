import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faPlayCircle, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/landingpage.css';

const LandingPage = ({ user }) => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate(`/explore`);
    };

    const handleSignInClick = () => {
        if(!user)
        {
            navigate(`/signin`);
        }
        else
        {
            navigate(`/profile`);
        }
    };

  return (
    <div className="landing-page">
        <div className='container'>
            <div className='text-box col-12 col-md-4'>
                <h1 className='title'>PUZZLE<br></br>PAGE</h1>
            
                <p className='body'>Lorem Ipsum tecx,Ipsum tecx, Ipsum tecxIpsum tecx, Ipsum tecxIpsum tecxIpsum tecxIpsum tecxIpsum tecxIpsum tecxIpsum tecx. </p>

                <button onClick={() => handleExploreClick()} className="explore-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> Explore
                </button>      
                { user ? (
                    <button onClick={() => handleSignInClick()} className="signin-button">
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </button>    
                ) : (
                    <button onClick={() => handleSignInClick()} className="signin-button">
                        <FontAwesomeIcon icon={faUser} /> Sign In
                    </button>   
                )}
            </div>
        </div>
    </div>
  );
};

export default LandingPage;
